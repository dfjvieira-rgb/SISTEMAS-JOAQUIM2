// folha-engine.js - VERSÃO TURBO BLINDADA COM QUEBRA AUTOMÁTICA
export const FolhaEngine = {
    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        // Mantemos os 150 a 180 conforme padrão FGV
        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            
            row.innerHTML = `
                <div class="linha-num" title="Clique duplo para revisão" 
                    ondblclick="this.parentElement.style.background = this.parentElement.style.background === 'rgba(251, 191, 36, 0.2)' ? 'transparent' : 'rgba(251, 191, 36, 0.2)'">
                    ${i}
                </div>
                <input class="linha-folha" id="L${i}" maxlength="${limite + 10}" 
                       spellcheck="false" autocomplete="off" 
                       data-index="${i}"
                       style="padding-right: 20px !important;"> 
            `;
            container.appendChild(row);

            const input = row.querySelector('input');
            
            // --- LÓGICA DE QUEBRA E SALTO DE MARGEM ---
            input.addEventListener('input', (e) => {
                const value = input.value;
                const count = value.length;
                
                // 1. Alerta visual de proximidade da margem (Amarelo 70, Vermelho 80)
                if (count >= 80) input.style.color = "#f87171";
                else if (count >= 70) input.style.color = "#fbbf24";
                else input.style.color = "inherit";

                // 2. Lógica de Quebra Automática (O pulo do gato)
                if (count >= limite) {
                    const palavras = value.split(" ");
                    const ultimaPalavra = palavras.pop(); // Pega o que está sendo digitado
                    const textoFica = palavras.join(" "); // O que fica na linha atual
                    
                    const next = document.getElementById(`L${i + 1}`);
                    if (next) {
                        // Corta a palavra incompleta da linha atual
                        input.value = textoFica;
                        // Joga a palavra para a linha seguinte e foca
                        next.focus();
                        next.value = ultimaPalavra + (e.data || ""); 
                    }
                }
            });

            // --- ATALHOS DE TECLADO (BACKSPACE E PARÁGRAFO) ---
            input.addEventListener('keydown', (e) => {
                // Atalho de Parágrafo (Se digitar 2 espaços no início, ele vira um tab de 10)
                if (e.code === 'Space' && input.value === "  ") {
                    e.preventDefault();
                    input.value = "          "; 
                }

                // Backspace Inteligente: Se apagar tudo no início da linha, volta para a anterior
                if (e.key === 'Backspace' && input.value === "" && i > 1) {
                    const prev = document.getElementById(`L${i - 1}`);
                    if (prev) {
                        e.preventDefault();
                        prev.focus();
                        // Coloca o cursor no final do texto da linha anterior
                        const val = prev.value;
                        prev.value = "";
                        prev.value = val;
                    }
                }
            });
        }
    }
};
