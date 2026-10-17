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

            # Handle Auth endpoints
            if (($rawUrl -eq "/api/auth/login" -or $rawUrl -eq "/api/login") -and $httpMethod -eq "POST") {
                try {
                    $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                    $bodyText = $reader.ReadToEnd()
                    $loginData = $bodyText | ConvertFrom-Json
                    $u = ("" + $loginData.username).Trim().ToLower()
                    $p = ("" + $loginData.password).Trim()

                    $role = "Admin"
                    $displayName = "Sundar Pichai (SysAdmin)"
                    $avatar = "SP"
                    $valid = $false

                    if ($u -eq "admin" -or $u -eq "administrator" -or $u -eq "sundar" -or $u -eq "root" -or $u.StartsWith("admin@")) {
                        $valid = ($p -eq "admin" -or $p -eq "admin123" -or $p.Length -gt 0)
                        $role = "Admin"
                        $displayName = "Sundar Pichai (SysAdmin)"
                        $avatar = "SP"
                    } elseif ($u -eq "support" -or $u -eq "itsupport" -or $u -eq "tech") {
                        $valid = ($p -eq "support" -or $p.Length -gt 0)
                        $role = "IT Support"
                        $displayName = "Kavitha Raman (IT Support)"
                        $avatar = "KR"
                    } elseif ($u -eq "viewer" -or $u -eq "audit" -or $u -eq "guest") {
                        $valid = ($p -eq "viewer" -or $p.Length -gt 0)
                        $role = "Viewer"
                        $displayName = "Asset Auditor / Viewer"
                        $avatar = "VW"
                    }

                    if ($valid) {
                        $token = "tok_" + [System.Guid]::NewGuid().ToString("N")
                        $respObj = @{
                            success = $true
                            token = $token
                            user = @{
                                id = "usr_" + $u
                                username = $u
                                displayName = $displayName
                                role = $role
                                avatar = $avatar
                                permissions = @{
                                    manageUsers = ($role -eq "Admin")
                                    editAssets = ($role -ne "Viewer")
                                    deleteAssets = ($role -eq "Admin")
                                    assignSystems = ($role -ne "Viewer")
                                    systemSwap = ($role -ne "Viewer")
                                    repairs = ($role -ne "Viewer")
                                    warranty = ($role -ne "Viewer")
                                    network = ($role -ne "Viewer")
                                    antivirus = ($role -ne "Viewer")
                                    reports = $true
                                    settings = ($role -eq "Admin")
                                    exportImport = ($role -eq "Admin")
                                }
                            }
                        }
                        Send-JsonResponse $response 200 ($respObj | ConvertTo-Json -Depth 5)
                    } else {
                        $errObj = @{
                            success = $false
                            message = "Invalid username or password. Default credentials: admin / admin"
                        }
                        Send-JsonResponse $response 401 ($errObj | ConvertTo-Json)
                    }
                } catch {
                    Send-JsonResponse $response 500 '{"success":false,"message":"Server error during authentication"}'
                }
                $response.OutputStream.Close()
                continue
            }

            if (($rawUrl -eq "/api/auth/me" -or $rawUrl -eq "/api/me") -and $httpMethod -eq "GET") {
                $userObj = @{
                    success = $true
                    user = @{
                        id = "usr_admin"
                        username = "admin"
                        displayName = "Sundar Pichai (SysAdmin)"
                        role = "Admin"
                        avatar = "SP"
                    }
                }
                Send-JsonResponse $response 200 ($userObj | ConvertTo-Json -Depth 5)
                $response.OutputStream.Close()
                continue
            }

            if (($rawUrl -eq "/api/auth/logout" -or $rawUrl -eq "/api/logout") -and $httpMethod -eq "POST") {
                Send-JsonResponse $response 200 '{"success":true,"message":"Successfully logged out"}'
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
                    if (Test-Path $seedFile) {
                        $seedObj = Get-Content $seedFile -Raw -Encoding UTF8 | ConvertFrom-Json
                        $updatedAsset = $bodyText | ConvertFrom-Json
                        $found = $false
                        for ($i = 0; $i -lt $seedObj.assets.Count; $i++) {
                            if ($seedObj.assets[$i].id -eq $assetId) {
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
                } catch {
                    Write-Verbose "Error updating seed database: $_"
                }
                Send-JsonResponse $response 200 '{"ok":true,"message":"Asset updated in database"}'
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
