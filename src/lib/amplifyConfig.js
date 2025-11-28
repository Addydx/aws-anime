// Configuración de Amplify para el proyecto
import { Amplify } from 'aws-amplify';

try {
  // Importar configuración de AWS
  const awsExports = await import('../aws-exports.js');
  
  // Configurar Amplify solo si la configuración es válida
  if (awsExports.default && awsExports.default.aws_project_region) {
    Amplify.configure(awsExports.default);
    console.log('Amplify configurado correctamente');
  } else {
    console.warn('Configuración de AWS incompleta. Ejecuta "amplify push" para completar.');
  }
} catch (error) {
  console.warn('Error cargando configuración de AWS:', error.message);
  console.warn('Ejecuta "amplify push" para generar la configuración completa.');
}

export { Amplify };