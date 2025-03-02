// Store contacts in localStorage
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

// Add Contact
function addContact(contact) {
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Delete Contact
function deleteContact(id) {
    contacts.splice(id, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
}

// Update Contact
function updateContact(id, updatedContact) {
    contacts[id] = updatedContact;
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Function to filter contacts
function filterContacts(searchText, searchType) {
    if (!searchText) {
        return contacts;
    }

    searchText = searchText.toLowerCase();
    return contacts.filter(contact => {
        switch (searchType) {
            case 'name':
                return contact.name.toLowerCase().includes(searchText);
            case 'email':
                return contact.email.toLowerCase().includes(searchText);
            case 'phone':
                return contact.phone.toLowerCase().includes(searchText);
            case 'all':
            default:
                return (
                    contact.name.toLowerCase().includes(searchText) ||
                    contact.email.toLowerCase().includes(searchText) ||
                    contact.phone.toLowerCase().includes(searchText)
                );
        }
    });
}

// Display Contacts
function displayContacts(filteredContacts = null) {
    const tableBody = document.getElementById('contactTableBody');
    if (!tableBody) return;

    const contactsToDisplay = filteredContacts || contacts;
    tableBody.innerHTML = '';
    
    contactsToDisplay.forEach((contact, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="contact-info">
                    <img src="${contact.profilePic || generateInitialsAvatar(contact.name)}" 
                         alt="${contact.name}" class="profile-pic">
                    <span>${contact.name}</span>
                </div>
            </td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.address}</td>
            <td class="action-buttons">
                <button onclick="window.location.href='edit.html?id=${index}'" class="btn edit-btn">Edit</button>
                <button onclick="deleteContact(${index})" class="btn delete-btn">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle Add Contact Form Submit
const addContactForm = document.getElementById('addContactForm');
if (addContactForm) {
    const profilePreview = document.getElementById('profilePreview');
    const profileInput = document.getElementById('profilePic');
    
    profileInput.addEventListener('change', (e) => handleProfilePicChange(e, profilePreview));
    
    addContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newContact = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            address: e.target.address.value,
            notes: e.target.notes.value,
            profilePic: profilePreview.src
        };
        addContact(newContact);
        window.location.href = 'view.html';
    });
}

// Handle Edit Contact Form
const editContactForm = document.getElementById('editContactForm');
if (editContactForm) {
    const profilePreview = document.getElementById('profilePreview');
    const profileInput = document.getElementById('profilePic');
    
    profileInput.addEventListener('change', (e) => handleProfilePicChange(e, profilePreview));
    
    const urlParams = new URLSearchParams(window.location.search);
    const contactId = urlParams.get('id');
    
    if (contactId !== null) {
        const contact = contacts[contactId];
        editContactForm.name.value = contact.name;
        editContactForm.email.value = contact.email;
        editContactForm.phone.value = contact.phone;
        editContactForm.address.value = contact.address;
        editContactForm.notes.value = contact.notes;
        profilePreview.src = contact.profilePic || generateInitialsAvatar(contact.name);
    }

    editContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedContact = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            address: e.target.address.value,
            notes: e.target.notes.value,
            profilePic: profilePreview.src
        };
        updateContact(contactId, updatedContact);
        window.location.href = 'view.html';
    });
}

// Add event listeners for search functionality
if (window.location.pathname.includes('view.html')) {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');

    // Initial contacts load
    displayContacts();

    // Add search event listeners
    searchInput.addEventListener('input', () => {
        const filteredContacts = filterContacts(searchInput.value, searchType.value);
        displayContacts(filteredContacts);
    });

    searchType.addEventListener('change', () => {
        const filteredContacts = filterContacts(searchInput.value, searchType.value);
        displayContacts(filteredContacts);
    });
}

// Function to generate initials avatar
function generateInitialsAvatar(name) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;

    // Background color (using our lavender theme)
    context.fillStyle = '#9B7EDE';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Text settings
    context.fillStyle = 'white';
    context.font = 'bold 40px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Get initials
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Draw initials
    context.fillText(initials, canvas.width/2, canvas.height/2);

    return canvas.toDataURL('image/png');
}

// Handle file input change
function handleProfilePicChange(event, imgPreview) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgPreview.src = e.target.result;
            imgPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}
  