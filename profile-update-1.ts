  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', bio: '' })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  })