import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const projectRootPath = fileURLToPath(new URL('..', import.meta.url));
const distPath = new URL('../dist', import.meta.url);
const esmPath = new URL('../dist/esm', import.meta.url);

const runBabel = async (configFile, outDir) => {
    await execFileAsync(
        'npx',
        ['babel', 'src', '--out-dir', outDir, '--config-file', configFile],
        {
            cwd: projectRootPath,
        }
    );
};

const convertDirectoryToMjs = async (directory) => {
    const directoryPath = fileURLToPath(directory);
    const fileNames = await readdir(directoryPath);

    for (const fileName of fileNames) {
        if (!fileName.endsWith('.js')) {
            continue;
        }

        const sourcePath = join(directoryPath, fileName);
        const targetPath = sourcePath.replace(/\.js$/, '.mjs');
        const fileContents = await readFile(sourcePath, 'utf8');
        const updatedContents = fileContents.replaceAll(/from '(\.\/.+?)'/g, "from '$1.mjs'");

        await writeFile(sourcePath, updatedContents);
        await rename(sourcePath, targetPath);
    }
};

await rm(distPath, { recursive: true, force: true });
await mkdir(esmPath, { recursive: true });

await runBabel('./babel.config.json', 'dist');
await runBabel('./babel.esm.config.json', 'dist/esm');
await convertDirectoryToMjs(esmPath);
