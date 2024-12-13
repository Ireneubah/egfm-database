function addSection(sectionId, templateId) {
    const section = document.getElementById(sectionId);
    const template = document.getElementById(templateId).content.cloneNode(true);
    section.appendChild(template);
}

function removeSection(button) {
    const section = button.parentElement;
    section.parentElement.removeChild(section);
}