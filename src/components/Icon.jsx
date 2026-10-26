const icons = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9" /><path d="M9 21v-7h6v7" /></>,
  folder: <><path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 9h18" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19 13.5 2 1.5-2 3-2.3-.8a7 7 0 0 1-2 1.1L14.3 21h-4.6l-.4-2.7a7 7 0 0 1-2-1.1L5 18l-2-3 2-1.5a7 7 0 0 1 0-2.3L3 9.7l2-3 2.3.8a7 7 0 0 1 2-1.1L9.7 4h4.6l.4 2.4a7 7 0 0 1 2 1.1L19 6.7l2 3-2 1.5a7 7 0 0 1 0 2.3Z" /></>,
  logout: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  git: <><path d="M12 3a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v2a3 3 0 1 0 3-3V9a3 3 0 0 0 0-6Z" /><circle cx="12" cy="6" r="1" /><circle cx="9" cy="10" r="1" /><circle cx="12" cy="18" r="1" /></>,
  branch: <><circle cx="6" cy="4" r="2" /><circle cx="6" cy="20" r="2" /><circle cx="18" cy="7" r="2" /><path d="M6 6v12M18 9a7 7 0 0 1-7 7H8" /></>,
  commit: <><circle cx="12" cy="12" r="4" /><path d="M2 12h6m8 0h6" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  code: <><path d="m8 17-5-5 5-5m8 0 5 5-5 5m-2-12-4 14" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
  camera: <><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" /><circle cx="12" cy="13" r="3.5" /></>,
  network: <><circle cx="12" cy="5" r="3" /><circle cx="5" cy="18" r="3" /><circle cx="19" cy="18" r="3" /><path d="m10.5 7.5-4 8m7-8 4 8M8 18h8" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  external: <><path d="M13 5h6v6M19 5l-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
};

export default function Icon({ name, size = 19 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.folder}
    </svg>
  );
}