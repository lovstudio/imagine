import "./style.css"
import {
  CREATION_MODES,
  buildSkillsUrl,
  createBrief,
  getCreationMode,
  type CreationModeId,
} from "./brief.ts"

const STORAGE_KEY = "lovcreate.brief.v1"
const modeList = document.querySelector<HTMLDivElement>("#mode-list")!
const form = document.querySelector<HTMLFormElement>("#brief-form")!
const intent = document.querySelector<HTMLTextAreaElement>("#intent")!
const intentCount = document.querySelector<HTMLSpanElement>("#intent-count")!
const modeDescription = document.querySelector<HTMLParagraphElement>("#mode-description")!
const output = document.querySelector<HTMLElement>("#brief-output")!
const briefText = document.querySelector<HTMLElement>("#brief-text")!
const skillsLink = document.querySelector<HTMLAnchorElement>("#skills-link")!
const copyButton = document.querySelector<HTMLButtonElement>("#copy-brief")!
const copyStatus = document.querySelector<HTMLSpanElement>("#copy-status")!

let selectedModeId: CreationModeId = "image"

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as {
    modeId?: string
    intent?: string
  } | null
  if (saved?.modeId && CREATION_MODES.some((mode) => mode.id === saved.modeId)) {
    selectedModeId = saved.modeId as CreationModeId
  }
  if (typeof saved?.intent === "string") intent.value = saved.intent.slice(0, 800)
} catch {
  localStorage.removeItem(STORAGE_KEY)
}

function saveDraft() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ modeId: selectedModeId, intent: intent.value })
  )
}

function renderModeList() {
  modeList.replaceChildren(
    ...CREATION_MODES.map((mode) => {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "mode-button"
      button.dataset.mode = mode.id
      button.setAttribute("aria-pressed", String(mode.id === selectedModeId))
      button.innerHTML = `<span>${mode.number}</span><strong>${mode.label}</strong><small>${mode.labelEn}</small>`
      button.addEventListener("click", () => {
        selectedModeId = mode.id
        renderModeList()
        renderSelectedMode()
        saveDraft()
        intent.focus()
      })
      return button
    })
  )
}

function renderSelectedMode() {
  const mode = getCreationMode(selectedModeId)
  intent.placeholder = mode.placeholder
  modeDescription.textContent = mode.description
}

function updateCount() {
  intentCount.textContent = String(intent.value.length)
}

intent.addEventListener("input", () => {
  updateCount()
  saveDraft()
})

form.addEventListener("submit", (event) => {
  event.preventDefault()
  if (!intent.reportValidity()) return

  const brief = createBrief(selectedModeId, intent.value)
  briefText.textContent = brief
  skillsLink.href = buildSkillsUrl(selectedModeId, intent.value)
  output.hidden = false
  copyStatus.textContent = ""
  output.scrollIntoView({ behavior: "smooth", block: "start" })
})

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(briefText.textContent ?? "")
    copyStatus.textContent = "已复制"
  } catch {
    copyStatus.textContent = "复制失败，请手动选择文字。"
  }
})

renderModeList()
renderSelectedMode()
updateCount()
