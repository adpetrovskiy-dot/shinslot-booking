import { spawn } from 'node:child_process';

const rawArgs = process.argv.slice(2);
const mappedArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    const val = rawArgs[i + 1];
    i++;
    mappedArgs.push('-H', val || '0.0.0.0');
  } else if (arg.startsWith('--host=')) {
    mappedArgs.push('-H', arg.slice(7));
  } else {
    mappedArgs.push(arg);
  }
}

if (!mappedArgs.includes('-p') && !mappedArgs.includes('--port')) {
  mappedArgs.push('-p', '3000');
}
if (!mappedArgs.includes('-H') && !mappedArgs.includes('--hostname')) {
  mappedArgs.push('-H', '0.0.0.0');
}

const child = spawn('npx', ['next', 'dev', ...mappedArgs], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
