import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import path from 'path';

const noita_path = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Noita';
const noita_exe = 'noita.exe';

export const registerLaunchHandlers = () => {
  ipcMain.handle('noita:launch-master', async (event, args?: string[]) => {
    args ??= [];

    execFile(
      path.join(noita_path, noita_exe),
      ['-no_logo_splashes -magic_numbers magic.txt'],
      { cwd: noita_path },
      (error: Error, stdout: string, stderr: string) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
        console.log(`Output: ${stdout}`);
      },
    );
  });
};
