visualizarImpressao: () => {
    const editor = document.getElementById('editor-principal');
    if (!editor) return;
    
    const conteudo = editor.innerText;
    const linhas = conteudo.split('\n');
    const exameAtivo = localStorage.getItem('activeEx') || "---";

    const overlay = document.createElement('div');
    overlay.style = "position:fixed; inset:0; background:#333d47; z-index:999999; overflow-y:auto; display:flex; flex-direction:column; align-items:center; padding:40px 15px; font-family:'Courier New', monospace;";
    
    const btnSair = document.createElement('button');
    btnSair.innerHTML = "<b>VOLTAR AO EDITOR</b>";
    btnSair.style = "position:fixed; top:15px; left:15px; padding:12px 25px; background:#fbbf24; border:none; border-radius:5px; cursor:pointer; font-size:12px; z-index:1000; box-shadow:0 4px 10px rgba(0,0,0,0.3);";
    btnSair.onclick = () => overlay.remove();

    const papel = document.createElement('div');
    papel.style = "background:white; width:100%; max-width:820px; padding:60px 50px; box-shadow:0 0 40px rgba(0,0,0,0.5); position:relative; color:#000;";

    let htmlFinal = `
        <div style="text-align:center; border:3px solid #000; padding:15px; margin-bottom:40px; font-family: Arial, sans-serif;">
            <h2 style="margin:0; font-size:18px;">CADERNO DE TEXTO DEFINITIVO - EXAME ${exameAtivo}</h2>
        </div>
    `;

    // O SEGREDO DO ALINHAMENTO ESTÁ AQUI:
    for (let i = 1; i <= 150; i++) {
        const textoLinha = linhas[i - 1] || "";
        htmlFinal += `
            <div style="display:flex; border-bottom:1px solid #d1d5db; height:35px; min-height:35px; max-height:35px; align-items:center; box-sizing:border-box; overflow:hidden;">
                <span style="width:40px; min-width:40px; color:#1e293b; font-size:12px; font-weight:bold; border-right:2px solid #000; margin-right:15px; display:flex; align-items:center; justify-content:center; background:#eee; height:35px; user-select:none;">
                    ${i}
                </span>
                <span style="flex:1; white-space:pre; font-size:18px; line-height:35px; height:35px; display:block; overflow:hidden; font-weight:700;">${textoLinha}</span>
            </div>
        `;
    }

    papel.innerHTML = htmlFinal;
    overlay.appendChild(btnSair);
    overlay.appendChild(papel);
    document.body.appendChild(overlay);
}
