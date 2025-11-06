
export const calculateAge = (birthDate: any) => {
    // Se o birthDate for um objeto vazio ou inválido, retorna "N/A"
    if (!birthDate || typeof birthDate === 'object' && Object.keys(birthDate).length === 0) {
        return "N/A";
    }

    try {
        const today = new Date();
        const birth = new Date(birthDate);

        // Verifica se a data é válida
        if (isNaN(birth.getTime())) {
            return "N/A";
        }

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age.toString();
    } catch (error) {
        console.error('Erro ao calcular idade:', error);
        return "N/A";
    }
};