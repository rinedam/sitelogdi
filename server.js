const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Normalize a URL removendo caracteres potencialmente perigosos
    let filePath = path.normalize(req.url);
    
    // Remove query strings da URL
    filePath = filePath.split('?')[0];

    // Tratamento especial para a raiz
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    // Define o caminho base do arquivo
    filePath = path.join(__dirname, filePath);

    // Log para debug
    console.log('Requisição para:', req.url);
    console.log('Caminho do arquivo:', filePath);

    // Verifica se é um diretório
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'font/otf',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Verifica se o arquivo existe antes de tentar lê-lo
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Arquivo não encontrado:', filePath);
            res.writeHead(404);
            res.end(`Arquivo não encontrado: ${req.url}`);
            return;
        }

        // Lê o arquivo somente se ele existir
        fs.readFile(filePath, (err, content) => {
            if (err) {
                console.error('Erro ao ler arquivo:', err);
                res.writeHead(500);
                res.end(`Erro do servidor: ${err.code}`);
            } else {
                res.writeHead(200, { 
                    'Content-Type': contentType,
                    'X-Content-Type-Options': 'nosniff'
                });
                res.end(content);
            }
        });
    });
});

const PORT = 8000;
server.listen(PORT, '0.0.0.0', () => {
    const interfaces = require('os').networkInterfaces();
    const addresses = [];
    
    for (const k in interfaces) {
        for (const addr of interfaces[k]) {
            if (addr.family === 'IPv4' && !addr.internal) {
                addresses.push(addr.address);
            }
        }
    }
    
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Endereços IP para acesso na rede local:');
    addresses.forEach(addr => {
        console.log(`http://${addr}:${PORT}`);
    });
    console.log(`Diretório base: ${__dirname}`);
});