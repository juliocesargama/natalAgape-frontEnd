export function formatPhone(phone: string): string {
    if (!phone) return '';
    // Exemplo de máscara: (XX) XXXXX-XXXX
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}