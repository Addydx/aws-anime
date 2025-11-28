// Configuración de Amplify para el proyecto
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports.js';

// Configurar Amplify
Amplify.configure(awsExports);

export { Amplify };