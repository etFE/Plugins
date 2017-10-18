const { getData, getArchives } = require('./selectData');
const { getGridData } = require('./gridData');
const { getTreeDept } = require('./treeData');
const fs = require('fs');

const route = (server) => {
    server.get('/etSelect', (req, res) => {
        const result = getData();
        res.send(result);
    });
    server.get('/etGrid', (req, res) => {
        const result = getGridData();
        res.send(result);
    });
    server.post('/etUpload', (req, res) => {
        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });
        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const path = 'C:\\Users\\41756\\Desktop\\testUpload\\image.jpg';
            fs.writeFile(path, buffer, () => {
                res.send('upload success');
            });
        });
    });

    // 部门结构数据
    server.post('/hr/deptTree', (req, res) => {
        const data = getTreeDept();
        res.json(data);
    });

    // 档案下拉框
    server.post('/hr/archives', (req, res) => {
        const data = getArchives();
        res.json(data);
    });
};

module.exports = { route };

