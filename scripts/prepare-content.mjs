import { cp, mkdir, rm } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"

const root = process.cwd()
const assetsSource = path.join(root, "content", "assets")
const assetsTarget = path.join(root, "static", "assets")

if (existsSync(assetsSource)) {
  await rm(assetsTarget, { recursive: true, force: true })
  await mkdir(path.dirname(assetsTarget), { recursive: true })
  await cp(assetsSource, assetsTarget, { recursive: true })
} else {
  await mkdir(path.join(root, "content"), { recursive: true })
}
