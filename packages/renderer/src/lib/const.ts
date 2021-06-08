import { useElectron } from '@/lib/use-electron';
const { bufferFrom } = useElectron();

export const BlankBuffer = bufferFrom('');
