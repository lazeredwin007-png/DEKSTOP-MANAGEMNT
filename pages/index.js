const fs = require('fs');
const path = require('path');

export default function Home() {
  return null;
}

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(html);
  res.end();
  return { props: {} };
}
