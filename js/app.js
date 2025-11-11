// Funcionalidad para las pestañas principales
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// Funcionalidad para los pasos
document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('click', function() {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
    });
});

// Funcionalidad para las pestañas de sección
document.querySelectorAll('.section-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// Funcionalidad para el botón Guardar
document.querySelector('.save-button').addEventListener('click', function() {
    const requiredFields = document.querySelectorAll('input.required');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
        } else {
            field.style.borderColor = '#e9ecef';
        }
    });
    
    if (isValid) {
        alert('Formulario guardado correctamente');
        // Aquí iría la lógica para enviar los datos al servidor
    } else {
        alert('Por favor, complete todos los campos obligatorios');
    }
});

// Efectos de hover mejorados
document.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    });
    
    field.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Validación en tiempo real para campos requeridos
document.querySelectorAll('input.required').forEach(field => {
    field.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });
});
