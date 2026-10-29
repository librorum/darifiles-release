const gallery_tabs = [...document.querySelectorAll('[role="tab"]')]

function showScreen(tab) {
  for (const item of gallery_tabs) {
    const selected = item === tab
    item.setAttribute('aria-selected', String(selected))
    item.tabIndex = selected ? 0 : -1
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected
  }
}

function onGalleryClick(event) {
  showScreen(event.currentTarget)
}

function onGalleryKeydown(event) {
  const index = gallery_tabs.indexOf(event.currentTarget)
  let next_index
  if (event.key === 'ArrowRight') next_index = (index + 1) % gallery_tabs.length
  if (event.key === 'ArrowLeft') next_index = (index + gallery_tabs.length - 1) % gallery_tabs.length
  if (event.key === 'Home') next_index = 0
  if (event.key === 'End') next_index = gallery_tabs.length - 1
  if (next_index === undefined) return
  event.preventDefault()
  showScreen(gallery_tabs[next_index])
  gallery_tabs[next_index].focus()
}

for (const tab of gallery_tabs) {
  tab.addEventListener('click', onGalleryClick)
  tab.addEventListener('keydown', onGalleryKeydown)
}

function showDeviceDownloads() {
  const agent = navigator.userAgent.toLowerCase()
  if (/android|iphone|ipad/.test(agent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    document.getElementById('device_hint').textContent = '다리파일은 데스크톱 앱입니다. 컴퓨터에서 이 페이지를 열어 설치하세요.'
    return
  }
  const platform = agent.includes('mac') ? 'mac' : agent.includes('win') ? 'windows' : agent.includes('linux') ? 'linux' : null
  if (!platform) return
  for (const item of document.querySelectorAll(`[data-platform="${platform}"]`)) item.classList.add('recommended')
  document.getElementById('device_hint').textContent = platform === 'mac'
    ? 'macOS로 접속했습니다. ‘이 Mac에 관하여’에서 Apple Silicon인지 Intel인지 확인하세요.'
    : `${platform === 'windows' ? 'Windows' : 'Linux'}로 접속했습니다. x86_64 컴퓨터용 파일을 선택하세요.`
}

async function loadLatestRelease() {
  try {
    const response = await fetch('https://api.github.com/repos/librorum/darifiles-release/releases/latest', { signal: AbortSignal.timeout(8000) })
    if (!response.ok) return
    const release = await response.json()
    if (release.draft || release.prerelease || !/^v?\d+\.\d+\.\d+$/.test(release.tag_name)) return
    document.getElementById('release_status').textContent = `현재 공개 버전 ${release.tag_name}. 아래 버튼에서 최신 설치 파일을 받으세요.`
  } catch {
    // 연결이 없어도 고정된 GitHub 최신 릴리즈 링크를 계속 사용할 수 있다.
  }
}

showDeviceDownloads()
loadLatestRelease()
