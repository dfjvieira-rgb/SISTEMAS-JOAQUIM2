// ... (mantenha todo o código anterior de montar e injetarTextoMultilinhas)

    visualizarImpressao: () => {
        const editor = document.getElementById('editor-principal');
        if (!editor) return;
        
        const conteudo = editor.innerText;
        const linhas = conteudo.split('\n');
        const exameAtivo = localStorage.getItem('activeEx') || "---";

        // Overlay de Visualização Profissional
        const overlay = document.createElement('div');
        overlay.id = "visualizacao-elite";
        overlay.style = `
            position: fixed; inset: 0; background: #333d47; 
            z-index: 999999; overflow-y: auto; display: flex; 
            flex-direction: column; align-items: center; padding: 40px 15px;
            font-family: 'Courier New', Courier, monospace;
        `;

        // Botão Voltar Estilizado
        const btnSair = document.createElement('button');
        btnSair.innerHTML = '<i class="fas fa-chevron-left"></i> VOLTAR AO EDITOR';
        btnSair.style = `
            position: fixed; top: 15px; left: 15px; padding: 12px 25px;
            background: #fbbf24; border: none; border-radius: 30px;
            font-weight: 900; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            z-index: 1000000; transition: transform 0.2s;
        `;
        btnSair.onmouseover = () => btnSair.style.transform = "scale(1.05)";
        btnSair.onmouseout = () => btnSair.style.transform = "scale(1)";
        btnSair.onclick = () => overlay.remove();

        // Folha de Papel (Padrão FGV)
        const papel = document.createElement('div');
        papel.style = `
            background: white; width: 100%; max-width: 820px;
            min-height: 1160px; padding: 60px 50px; box-shadow: 0 0 40px rgba(0,0,0,0.6);
            position: relative; line-height: 35px; color: #000; font-size: 18px;
            border-radius: 2px;
        `;

        // Cabeçalho da Folha
        const cabecalho = `
            <div style="text-align: center; border: 3px solid #000; padding: 15px; margin-bottom: 40px;">
                <h2 style="margin: 0; font-size: 20px;">PROVA PRÁTICO-PROFISSIONAL - EXAME ${exameAtivo}</h2>
                <p style="margin: 5px 0 0 0; font-size: 14px;">CADERNO DE TEXTO DEFINITIVO - PEÇA PROFISSIONAL</p>
            </div>
        `;

        // Gerar linhas numeradas (exatamente 150)
        let corpoFolha = "";
        for (let i = 1; i <= 150; i++) {
            const textoLinha = linhas[i - 1] || "";
            corpoFolha += `
                <div style="display: flex; border-bottom: 1px solid #eee; height: 35px; align-items: center;">
                    <span style="width: 35px; color: #aaa; font-size: 11px; border-right: 1px solid #eee; margin-right: 15px; display: block; text-align: center;">
                        ${i}
                    </span>
                    <span style="flex: 1; white-space: pre-wrap; overflow: hidden;">${textoLinha}</span>
                </div>
            `;
        }

        papel.innerHTML = cabecalho + corpoFolha;
        overlay.appendChild(btnSair);
        overlay.appendChild(papel);
        document.body.appendChild(overlay);
    }
};
