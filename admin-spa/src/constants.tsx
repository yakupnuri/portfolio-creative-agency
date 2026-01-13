import React from 'react';

export const API_BASE_URL = '';

export const ROLE_PERMISSIONS = {
  owner: ['all'],
  admin: ['manage_briefs', 'manage_projects', 'manage_clients', 'manage_content', 'uploads'],
  editor: ['view_briefs', 'edit_draft_projects', 'edit_draft_content']
};

export const Icons = {
  Dashboard: <span className="material-symbols-outlined">dashboard</span>,
  Projects: <span className="material-symbols-outlined">layers</span>,
  Briefs: <span className="material-symbols-outlined">mail</span>,
  Clients: <span className="material-symbols-outlined">group</span>,
  Content: <span className="material-symbols-outlined">article</span>,
  Users: <span className="material-symbols-outlined">manage_accounts</span>,
  Settings: <span className="material-symbols-outlined">settings</span>,
  Logout: <span className="material-symbols-outlined">logout</span>,
  Add: <span className="material-symbols-outlined">add</span>,
  Edit: <span className="material-symbols-outlined">edit</span>,
  Delete: <span className="material-symbols-outlined">delete</span>,
  Publish: <span className="material-symbols-outlined">publish</span>,
  Save: <span className="material-symbols-outlined">save</span>,
  Search: <span className="material-symbols-outlined">search</span>,
  Filter: <span className="material-symbols-outlined">filter_list</span>,
  Image: <span className="material-symbols-outlined">image</span>,
  Close: <span className="material-symbols-outlined">close</span>,
  CheckCircle: <span className="material-symbols-outlined">check_circle</span>,
};
