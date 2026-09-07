const WIDGET_URL = 'https://discord.com/api/guilds/638584249607520256/widget.json';
// The widget API doesn't always expose an instant_invite (it's null unless
// the server has one configured for the widget channel) — fill this in
// with a real discord.gg invite link once you have one.
const FALLBACK_INVITE_URL = 'https://discord.gg/DwPCmEFkQe';

fetch(WIDGET_URL)
  .then((res) => (res.ok ? res.json() : Promise.reject(new Error('widget fetch failed'))))
  .then((data) => {
    const card = document.getElementById('discord-card');
    document.getElementById('discord-name').textContent = data.name;
    document.getElementById('discord-online').textContent = data.presence_count;

    const avatarsEl = document.getElementById('discord-avatars');
    data.members.slice(0, 10).forEach((member) => {
      if (!member.avatar_url) return;
      const img = document.createElement('img');
      img.src = member.avatar_url;
      img.alt = member.username;
      img.className = 'discord-avatar';
      img.title = member.username;
      avatarsEl.appendChild(img);
    });

    const inviteUrl = data.instant_invite || FALLBACK_INVITE_URL;
    const joinBtn = document.getElementById('discord-join');
    if (inviteUrl) {
      joinBtn.href = inviteUrl;
    } else {
      joinBtn.hidden = true;
    }

    card.hidden = false;
  })
  .catch(() => {
    // Server widget disabled or unreachable — just stay hidden rather
    // than show a broken card.
  });
