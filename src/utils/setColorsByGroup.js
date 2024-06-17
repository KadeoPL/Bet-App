export function setColorsByGroup(group) {
    switch (group) {
        case 'Grupa A':
            return {bgColor: 'bg-green', textColor: 'text-white'}
        case 'Grupa B':
            return {bgColor: 'bg-darkblue', textColor: 'text-white'}
        case 'Grupa C':
            return {bgColor: 'bg-red', textColor: 'text-white'}
        case 'Grupa D':
            return {bgColor: 'bg-yellow', textColor: 'text-black'}
        case 'Grupa E':
            return {bgColor: 'bg-lightblue', textColor: 'text-black'}
        case 'Grupa F':
            return {bgColor: 'bg-black', textColor: 'text-white'}
        default:
            return {bgColor: 'bg-blue', textColor: 'text-white'}
    }
}