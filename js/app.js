:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    --success-color: #27ae60;
    --warning-color: #f39c12;
    --light-gray: #ecf0f1;
    --border-color: #bdc3c7;
    --text-color: #2c3e50;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
    color: var(--text-color);
    line-height: 1.6;
}

.app-header {
    background: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header h1 {
    font-size: 1.5rem;
}

.user-info {
    font-size: 0.9rem;
    opacity: 0.9;
}

.app-nav {
    background: white;
    padding: 0 2rem;
    border-bottom: 1px solid var(--light-gray);
    display: flex;
    gap: 0.5rem;
}

.nav-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.nav-btn:hover {
    background: var(--light-gray);
}

.nav-btn.active {
    border-bottom-color: var(--secondary-color);
    color: var(--secondary-color);
    font-weight: 600;
}

.app-main {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 70vh;
}

.section {
    display: none;
}

.section.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* FORMULARIO COMPLETO */
.form-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.form-container h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    border-bottom: 2px solid var(--light-gray);
    padding-bottom: 0.5rem;
}

.form-section {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--light-gray);
}

.form-section h3 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    font-size: 1.2rem;
    background: var(--light-gray);
    padding: 0.75rem 1rem;
    border-radius: 4px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
    font-size: 0.9rem;
}

.form-group label[required]::after {
    content: " *";
    color: var(--accent-color);
}

.form-input {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.3s ease;
    width: 100%;
}

.form-input:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-input:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
}

.checkbox-group {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    margin-bottom: 0;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
}

select.form-input[multiple] {
    height: 120px;
    padding: 0.5rem;
}

select.form-input[multiple] option {
    padding: 0.5rem;
}

/* BOTONES */
.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--light-gray);
}

.btn-primary {
    background: var(--secondary-color);
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary:hover {
    background: #2980b9;
}

.btn-secondary {
    background: var(--light-gray);
    color: var(--text-color);
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-secondary:hover {
    background: #d5dbdb;
}

/* BÚSQUEDA */
.search-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.search-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.search-bar input {
    flex: 1;
}

.search-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.search-filters select {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
}

.resultados-container {
    min-height: 200px;
}

.resultado-demo {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.resultado-demo h4 {
    color: #666;
    margin-bottom: 1rem;
    font-style: italic;
}

.resultado-item {
    background: white;
    border: 1px solid var(--light-gray);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: box-shadow 0.3s ease;
}

.resultado-item:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.resultado-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.resultado-header h4 {
    color: var(--primary-color);
    margin: 0;
}

.badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.badge.familiar {
    background: #e8f6f3;
    color: #1a5276;
}

.badge.afectado {
    background: #fef9e7;
    color: #7d6608;
}

.resultado-info {
    margin-bottom: 1rem;
}

.resultado-info p {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.resultado-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn-editar, .btn-ver, .btn-imprimir {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.3s ease;
}

.btn-editar {
    background: var(--warning-color);
    color: white;
}

.btn-editar:hover {
    background: #e67e22;
}

.btn-ver {
    background: var(--secondary-color);
    color: white;
}

.btn-ver:hover {
    background: #2980b9;
}

.btn-imprimir {
    background: var(--success-color);
    color: white;
}

.btn-imprimir:hover {
    background: #229954;
}

/* DASHBOARD */
.dashboard-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.metric-card {
    background: white;
    border: 1px solid var(--light-gray);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.metric-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.metric-card h3 {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--primary-color);
    display: block;
    margin-bottom: 0.5rem;
}

.metric-trend {
    font-size: 0.8rem;
    color: var(--success-color);
    font-weight: 600;
}

.dashboard-charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
}

.chart-container {
    background: var(--light-gray);
    padding: 1.5rem;
    border-radius: 8px;
}

.chart-container h4 {
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.chart-placeholder {
    background: white;
    padding: 2rem;
    border-radius: 4px;
    text-align: center;
    color: #666;
    font-style: italic;
}

.app-footer {
    background: var(--primary-color);
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .app-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        padding: 1rem;
    }
    
    .app-nav {
        padding: 0 1rem;
        overflow-x: auto;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .app-main {
        padding: 1rem;
    }
    
    .search-bar {
        flex-direction: column;
    }
    
    .search-filters {
        flex-direction: column;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .resultado-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .resultado-actions {
        justify-content: flex-start;
    }
    
    .dashboard-charts {
        grid-template-columns: 1fr;
    }
    
    .metrics-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .form-container, .search-container, .dashboard-container {
        padding: 1rem;
    }
    
    .form-section h3 {
        font-size: 1rem;
        padding: 0.5rem;
    }
}
