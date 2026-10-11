# Lightweight, resilient PowerShell HTTP Server for Pixel ITAM & Desktop Management
param([int]$port = 3000)

$listener = New-Object System.Net.HttpListener

# Support both localhost and 127.0.0.1
$prefixLocalhost = "http://localhost:$port/"
$prefixIp = "http://127.0.0.1:$port/"

try {
    $listener.Prefixes.Add($prefixLocalhost)
} catch {
    Write-Warning "Could not register $($prefixLocalhost) : $_"
}

try {
    $listener.Prefixes.Add($prefixIp)
} catch {
    # Ignore if 127.0.0.1 cannot be bound independently
}

try {
    $listener.Start()
} catch {
    Write-Error "Failed to start listener on port $port. It may already be in use. Error: $_"
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 Pixel ITAM Web Server is ACTIVE" -ForegroundColor Green
Write-Host " 🌐 Localhost URL: http://localhost:$port" -ForegroundColor Yellow
Write-Host " 🌐 Direct IP URL: http://127.0.0.1:$port" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server.`n"

$basePath = (Get-Location).Path
$parentDir = Split-Path $basePath -Parent
$itAssetManagerPath = Join-Path $parentDir "it-asset-manager"

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
    ".txt"   = "text/plain; charset=utf-8"
}

function Send-JsonResponse($response, [int]$statusCode, [string]$jsonContent) {
    $response.StatusCode = $statusCode
    $response.ContentType = "application/json; charset=utf-8"
    $response.AddHeader("Access-Control-Allow-Origin", "*")
    $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonContent)
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
}

$script:sqliteLoaded = $false
try {
    $winSqliteCode = @'
using System;
using System.Runtime.InteropServices;

public class WinSqlite {
    [DllImport("winsqlite3.dll", EntryPoint = "sqlite3_open", CallingConvention = CallingConvention.Cdecl)]
    public static extern int Open(string filename, out IntPtr db);

    [DllImport("winsqlite3.dll", EntryPoint = "sqlite3_close", CallingConvention = CallingConvention.Cdecl)]
    public static extern int Close(IntPtr db);

    [DllImport("winsqlite3.dll", EntryPoint = "sqlite3_exec", CallingConvention = CallingConvention.Cdecl)]
    public static extern int Exec(IntPtr db, string sql, IntPtr callback, IntPtr arg, out IntPtr errMsg);

    public static int ExecuteNonQuery(string dbPath, string sql) {
        IntPtr db;
        int rc = Open(dbPath, out db);
        if (rc != 0) return rc;
        IntPtr errMsg;
        rc = Exec(db, sql, IntPtr.Zero, IntPtr.Zero, out errMsg);
        Close(db);
        return rc;
    }
}
'@
    if (-not ([System.Management.Automation.PSTypeName]'WinSqlite').Type) {
        Add-Type -TypeDefinition $winSqliteCode -ErrorAction SilentlyContinue
    }
    $script:sqliteLoaded = $true
} catch {
    $script:sqliteLoaded = $false
}

function Escape-Sql([string]$str) {
    if ([string]::IsNullOrEmpty($str)) { return "''" }
    return "'" + $str.Replace("'", "''") + "'"
}

function Sync-SqliteAsset([string]$dbPath, $asset) {
    if (-not $script:sqliteLoaded -or -not (Test-Path $dbPath)) { return }
    try {
        $id = Escape-Sql $asset.id
        $type = Escape-Sql $asset.type
        $user = Escape-Sql $asset.user
        $team = Escape-Sql $asset.team
        $cpu = Escape-Sql $asset.cpu
        $ram = Escape-Sql $asset.ram
        $hdd = Escape-Sql $asset.hdd
        $ssd = Escape-Sql $asset.ssd
        $monitor = Escape-Sql $asset.monitor
        $serialNumber = Escape-Sql $asset.serialNumber
        $hostname = Escape-Sql $asset.hostname
        $ipAddress = Escape-Sql $asset.ipAddress
        $os = Escape-Sql $asset.os
        $location = Escape-Sql $asset.location
        $oldUsername = Escape-Sql $asset.oldUsername
        $assignedDate = Escape-Sql $asset.assignedDate
        $status = Escape-Sql $asset.status
        $condition = Escape-Sql $asset.condition
        $warrantyEnd = Escape-Sql $asset.warrantyEnd
        $remark = Escape-Sql $asset.remark
        $workStatus = Escape-Sql $asset.workStatus
        $warrantyType = Escape-Sql $asset.warrantyType
        $tl = Escape-Sql $asset.tl
        $userExitDate = Escape-Sql $asset.userExitDate
        $availableDate = Escape-Sql $asset.availableDate
        $componentsJson = "''"
        if ($asset.warrantyComponents) {
            $componentsJson = Escape-Sql ($asset.warrantyComponents | ConvertTo-Json -Compress)
        }

        $sql = @"
INSERT OR REPLACE INTO assets (
    id, type, user, team, cpu, ram, hdd, ssd, monitor,
    serialNumber, hostname, ipAddress, os, location, oldUsername,
    assignedDate, status, condition, warrantyEnd, remark,
    workStatus, warrantyType, tl, userExitDate, availableDate, warrantyComponents
) VALUES (
    $id, $type, $user, $team, $cpu, $ram, $hdd, $ssd, $monitor,
    $serialNumber, $hostname, $ipAddress, $os, $location, $oldUsername,
    $assignedDate, $status, $condition, $warrantyEnd, $remark,
    $workStatus, $warrantyType, $tl, $userExitDate, $availableDate, $componentsJson
);
"@
        [WinSqlite]::ExecuteNonQuery($dbPath, $sql) | Out-Null
    } catch {
        # Silent fallback
    }
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        
        try {
            $request = $context.Request
            $response = $context.Response
            $httpMethod = $request.HttpMethod.ToUpper()
            $rawUrl = $request.Url.LocalPath

            # CORS headers
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

            # Handle OPTIONS preflight
            if ($httpMethod -eq "OPTIONS") {
                $response.StatusCode = 204
                $response.ContentLength64 = 0
                $response.OutputStream.Close()
                continue
            }

            # Handle REST API endpoints
            if ($rawUrl -eq "/api/status") {
                $statusJson = '{"ok":true,"status":"healthy","driver":"PowerShell Local Server","port":' + $port + '}'
                Send-JsonResponse $response 200 $statusJson
                $response.OutputStream.Close()
                continue
            }

            if ($rawUrl -eq "/api/database/dump") {
                $seedFile = Join-Path $basePath "database_seed.json"
                if (Test-Path $seedFile) {
                    $json = [System.IO.File]::ReadAllText($seedFile, [System.Text.Encoding]::UTF8)
                    Send-JsonResponse $response 200 $json
                } else {
                    Send-JsonResponse $response 200 '{"assets":[],"users":[]}'
                }
                $response.OutputStream.Close()
                continue
            }

            if ($rawUrl.StartsWith("/api/assets/") -and $httpMethod -eq "PUT") {
                $assetId = [System.Uri]::UnescapeDataString($rawUrl.Substring("/api/assets/".Length))
                try {
                    $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                    $bodyText = $reader.ReadToEnd()
                    $seedFile = Join-Path $basePath "database_seed.json"
                    $updatedAsset = $bodyText | ConvertFrom-Json
                    if (Test-Path $seedFile) {
                        $seedObj = Get-Content $seedFile -Raw -Encoding UTF8 | ConvertFrom-Json
                        $found = $false
                        for ($i = 0; $i -lt $seedObj.assets.Count; $i++) {
                            if ($seedObj.assets[$i].id -eq $assetId -or $seedObj.assets[$i].id -eq $updatedAsset.id) {
                                $seedObj.assets[$i] = $updatedAsset
                                $found = $true
                                break
                            }
                        }
                        if (-not $found) {
                            $seedObj.assets += $updatedAsset
                        }
                        $newJson = $seedObj | ConvertTo-Json -Depth 25
                        [System.IO.File]::WriteAllText($seedFile, $newJson, [System.Text.Encoding]::UTF8)
                    }

                    # Live Sync with SQLite
                    $sqliteFile = Join-Path $basePath "it_assets.sqlite"
                    if (Test-Path $sqliteFile) {
                        if ($assetId -ne $updatedAsset.id) {
                            [WinSqlite]::ExecuteNonQuery($sqliteFile, "DELETE FROM assets WHERE id = " + (Escape-Sql $assetId) + ";") | Out-Null
                        }
                        Sync-SqliteAsset $sqliteFile $updatedAsset
                    }
                } catch {
                    Write-Verbose "Error updating database: $_"
                }
                Send-JsonResponse $response 200 '{"ok":true,"message":"Asset updated in database and SQLite"}'
                $response.OutputStream.Close()
                continue
            }

            if ($rawUrl.StartsWith("/api/")) {
                Send-JsonResponse $response 200 '{"ok":true,"message":"Saved locally"}'
                $response.OutputStream.Close()
                continue
            }

            # Static file resolution
            if ($rawUrl -eq "/" -or $rawUrl -eq "") {
                $rawUrl = "/index.html"
            }

            $resolvedFile = $null

            # Check primary workspace
            $candidatePath = Join-Path $basePath $rawUrl.TrimStart('/')
            if (Test-Path $candidatePath -PathType Leaf) {
                $resolvedFile = $candidatePath
            } elseif ($rawUrl.StartsWith("/it-asset-manager/")) {
                $subPath = $rawUrl.Substring("/it-asset-manager/".Length)
                if ([string]::IsNullOrWhiteSpace($subPath)) { $subPath = "index.html" }
                $itCandidate = Join-Path $itAssetManagerPath $subPath
                if (Test-Path $itCandidate -PathType Leaf) {
                    $resolvedFile = $itCandidate
                }
            } elseif ($rawUrl -eq "/it-asset-manager") {
                $itCandidate = Join-Path $itAssetManagerPath "index.html"
                if (Test-Path $itCandidate -PathType Leaf) {
                    $resolvedFile = $itCandidate
                }
            }

            if ($resolvedFile) {
                $ext = [System.IO.Path]::GetExtension($resolvedFile).ToLower()
                $mime = $mimeTypes[$ext]
                if (-not $mime) { $mime = "application/octet-stream" }
                $response.ContentType = $mime
                $response.StatusCode = 200

                $fileBytes = [System.IO.File]::ReadAllBytes($resolvedFile)
                $response.ContentLength64 = $fileBytes.Length

                if ($httpMethod -ne "HEAD") {
                    $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $response.ContentType = "text/plain; charset=utf-8"
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawUrl")
                $response.ContentLength64 = $msg.Length
                if ($httpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
        } catch {
            # Catch per-request exceptions without crashing listener
            Write-Verbose "Request error: $_"
        } finally {
            try { $response.OutputStream.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
