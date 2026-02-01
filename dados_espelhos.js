<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>ARYANNA MASTER PRO | 2026</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Courier+Prime&swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb; --success: #059669; --warning: #f59e0b; --danger: #e11d48;
            --bg-site: #f8fafc; --gold: #d4af37; --pen-blue: #1e3a8a; --paper: #ffffff; --text: #1e293b;
            --toolbar-bg: #ffffff; --border: #cbd5e1;
        }
        .dark-mode { --paper: #1e293b; --pen-blue: #93c5fd; --bg-site: #0f172a; --text: #f1f5f9; --toolbar-bg: #1e293b; --border: #334155; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: var(--bg-site); height: 100vh; display: flex; flex-direction: column; overflow: hidden; color: var(--text); }
        header { background: #1e293b; padding: 0 15px; border-bottom: 2px solid var(--gold); display: flex; justify-content: space-between; align-items: center; height: 45px; z-index: 1001; }
        .main-container { flex: 1; display: flex; overflow: hidden; position: relative; }
        .editor-section { flex: 1; display: flex; flex-direction: column; background: var(--bg-site); border-right: 1px solid var(--border); }
        .toolbar { background: var(--toolbar-bg); padding: 8px; display: flex; gap: 5px; border-bottom: 1px solid var(--border); overflow-x: auto; align-items: center; }
        .btn-symbol { height: 36px; min-width: 40px; border-radius: 8px; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; background: var(--toolbar-bg); color: var(--text); }
        .paper-wrapper { flex: 1; overflow-y: auto; padding: 10px; background: rgba(0,0,0,0.1); }
        .paper-sheet { width: 100%; max-width: 800px; background: var(--paper); min-height: 2000px; display: flex; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .line-nums { width: 35px; background: rgba(0,0,0,0.03); border-right: 1px solid var(--border); text-align: center; color: #94a3b8; font-size: 11px; padding-top: 15px; line-height: 28px; }
        .text-area { flex: 1; border: none; outline: none; padding: 11px 15px; font-size: 16px; line-height: 28px; color: var(--pen-blue); background-image: linear-gradient(transparent, transparent 27px, var(--border) 28px); background-size: 100% 28px; background-attachment: local; resize: none; background-color: transparent; }
        
        /* Modais */
        .modal-full { display: none; position: fixed; inset: 0; background: var(--bg-site); z-index: 9999; flex-direction: column; }
        .modal-header { background: #1e293b; color: white; padding: 0 15px; display: flex; align-items: center; border-bottom: 2px solid var(--gold); height: 50px; }
        .modal-body { flex: 1; overflow-y: auto; padding: 15px; }
        .btn-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 10px; border-radius: 6px; cursor: pointer; margin-right: 10px; }
        
        /* Espelho Checklist */
        .espelho-item { background: var(--paper); border: 1px solid var(--border); padding: 12px; margin-bottom: 8px; border-radius: 8px; display: flex; align-items: center; gap: 12px; }
        .espelho-item input { width: 22px; height: 22px; accent-color: var(--success); cursor: pointer; }
        .espelho-txt { flex: 1; font-size: 0.8rem; color: var(--text); font-weight: 500; }
        .espelho-pt { font-weight: 800; color: var(--primary); font-size: 0.8rem; background: rgba(37,99,235,0.1); padding: 4px 8px; border-radius: 4px; }
        
        #menu-estruturas { display: none; position: absolute; top: 50px; left: 20px; background: var(--toolbar-bg); border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); z-index: 5000; width: 280px; border: 1px solid var(--border); }
        .menu-item { padding: 12px; cursor: pointer; border-bottom: 1px solid var(--border); font-size: 0.75rem; color: var(--text); font-weight: 600; }
    </style>
</head>
<body class="dark-mode">

<header>
    <div style="font-weight: 800; color: var(--gold); font-size: 0.8rem;">ARYANNA MASTER 2026</div>
    <div id="timer-display" style="color:var(--warning); font-family:'Courier Prime'; font-weight:bold;">05:00:00</div>
</header>

<div class="main-container">
    <section class="editor-section">
        <div class="toolbar">
            <select id="exam-select" onchange="window.mudarExame()" class="btn-symbol" style="width:auto; font-size:0.75rem; font-weight:bold;"></select>
            <button class="btn-symbol" onclick="window.toggleEstruturas()">⚖️</button>
            <button class="btn-symbol" onclick="window.abrirModal('modal-espelho')">🎯</button>
            <button class="btn-symbol" onclick="window.abrirModal('modal-respostas')">📝</button>
            <button class="btn-symbol" onclick="window.toggleDarkMode()">🌓</button>
            <button class="btn-symbol" style="background:var(--success); color:white; margin-left:auto;" onclick="window.finalizarManual()">💾</button>
        </div>
        <div class="paper-wrapper">
            <div class="paper-sheet">
                <div class="line-nums" id="ln-main"></div>
                <textarea id="texto-final" class="text-area" spellcheck="false" oninput="window.autoSave()" placeholder="Sua peça aqui..."></textarea>
            </div>
        </div>
    </section>
</div>

<div id="menu-estruturas"></div>

<div id="modal-espelho" class="modal-full">
    <div class="modal-header">
        <button class="btn-back" onclick="window.fecharModal('modal-espelho')">← VOLTAR</button>
        <div style="flex:1; text-align:right; font-weight:900; color:var(--gold);">NOTA: <span id="nota-valor" style="background:var(--gold); color:black; padding:2px 8px; border-radius:4px;">0.00</span></div>
    </div>
    <div class="modal-body" id="checklist-fgv">
        </div>
</div>

<div id="modal-respostas" class="modal-full">
    <div class="modal-header"><button class="btn-back" onclick="window.fecharModal('modal-respostas')">← VOLTAR</button><h3>RESPOSTAS / POST-ITS</h3></div>
    <div class="modal-body"><div class="paper-sheet"><div class="line-nums" id="ln-res"></div><textarea id="res-editor" class="text-area" oninput="window.saveMeta('v3_respostas', this.value)"></textarea></div></div>
</div>

<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
    
    const config = { apiKey: "AIzaSyAmigODFK8R9c0-fWtagdxLWu9xkODfKYQ", authDomain: "masteroab-db5e1.firebaseapp.com", projectId: "masteroab-db5e1", databaseURL: "https://masteroab-db5e1-default-rtdb.firebaseio.com" };
    const app = initializeApp(config); const db = getDatabase(app);

    // ==========================================
    // 1. ESPAÇO PARA AS PEÇAS (COLE AQUI)
    // ==========================================
    const pecas = {
        'RT': 'AO DOUTO JUÍZO...',
        // Adicione as outras aqui
    };

    // ==========================================
    // 2. ESPAÇO PARA OS ESPELHOS (DADOS DA CORREÇÃO)
    // ==========================================
    const espelhosDados = {
        "44": [
            { txt: "Endereçamento ao Juízo da ... Vara do Trabalho de ...", pts: 0.10 },
            { txt: "Qualificação das partes e indicação do Art. 840, § 1º, da CLT", pts: 0.40 },
            { txt: "Tese de Mérito 01 (Exemplo: Verbas Rescisórias)", pts: 0.50 }
        ],
        "default": [
            { txt: "Item de correção padrão 01", pts: 0.50 },
            { txt: "Item de correção padrão 02", pts: 0.50 }
        ]
    };

    window.gerarPeca = (tipo) => {
        document.getElementById('texto-final').value = pecas[tipo] || "Modelo não configurado.";
        window.autoSave(); window.toggleEstruturas();
    };

    window.calcNota = () => {
        let total = 0;
        document.querySelectorAll('#checklist-fgv input:checked').forEach(i => total += parseFloat(i.value));
        document.getElementById('nota-valor').innerText = total.toFixed(2);
    };

    window.mudarExame = () => {
        const ex = document.getElementById('exam-select').value;
        const container = document.getElementById('checklist-fgv');
        const dados = espelhosDados[ex] || espelhosDados["default"];
        
        // GERA O HTML DO ESPELHO DINAMICAMENTE
        container.innerHTML = dados.map(item => `
            <div class="espelho-item">
                <input type="checkbox" value="${item.pts}" onchange="window.calcNota()">
                <div class="espelho-txt">${item.txt}</div>
                <div class="espelho-pt">${item.pts.toFixed(2)}</div>
            </div>
        `).join('');

        document.getElementById('nota-valor').innerText = "0.00";
        get(ref(db, `v3_treino/exame_${ex}`)).then(s => document.getElementById('texto-final').value = s.val() || "");
    };

    window.saveMeta = (path, val) => set(ref(db, `${path}/exame_${document.getElementById('exam-select').value}`), val);
    window.autoSave = () => { clearTimeout(window.sv); window.sv = setTimeout(() => window.saveMeta('v3_treino', document.getElementById('texto-final').value), 1000); };
    window.abrirModal = (id) => document.getElementById(id).style.display = 'flex';
    window.fecharModal = (id) => document.getElementById(id).style.display = 'none';
    window.toggleDarkMode = () => document.body.classList.toggle('dark-mode');
    window.toggleEstruturas = () => { const m = document.getElementById('menu-estruturas'); m.style.display = m.style.display==='block'?'none':'block'; };

    // Criar menu de peças
    const menu = document.getElementById('menu-estruturas');
    Object.keys(pecas).forEach(k => {
        const d = document.createElement('div'); d.className = 'menu-item'; d.innerText = k;
        d.onclick = () => window.gerarPeca(k); menu.appendChild(d);
    });

    const sel = document.getElementById('exam-select');
    for(let i=45; i>=1; i--) { 
        let n = i<10?"0"+i:i; let opt = document.createElement('option');
        opt.value=n; opt.innerText=`EXAME ${n}`; if(i==44) opt.selected=true;
        sel.appendChild(opt); 
    }
    document.getElementById('ln-main').innerHTML = Array.from({length:300}, (_,i)=>i+1).join('<br>');
    document.getElementById('ln-res').innerHTML = Array.from({length:100}, (_,i)=>i+1).join('<br>');
    window.mudarExame();
</script>
</body>
</html>