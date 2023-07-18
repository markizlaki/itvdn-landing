import del from 'del';
export const reset = () => {
    return del('build');
}