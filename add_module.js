const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'modules.json');
const modules = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Only add if not exists
if (!modules.some(m => m.slug === 'puerperio')) {
    modules.splice(2, 0, {
        "slug": "puerperio",
        "title": "Puerpério",
        "subtitle": "Cuidados pós-parto e saúde do RN",
        "accentColor": "#E9A8F8",
        "accentClass": "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
        "icon": "Baby",
        "pendingCount": 0,
        "protocols": [
            {
                "id": "pu1",
                "title": "Atenção ao Puerpério (MS)",
                "type": "Protocolo",
                "version": "2024"
            }
        ],
        "patients": []
    });
    fs.writeFileSync(filePath, JSON.stringify(modules, null, 4));
    console.log("Puerperio added correctly");
} else {
    console.log("Puerperio already exists");
}
