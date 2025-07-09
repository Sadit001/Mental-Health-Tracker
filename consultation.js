// Doctor Data
const doctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Clinical Psychologist",
        degree: "PhD in Clinical Psychology, Harvard University",
        experience: "15 years of experience",
        availability: "Mon-Fri: 9AM - 5PM, Sat: 10AM - 2PM",
        contact: "+1 (555) 123-4567",
        location: "123 Wellness St, Boston, MA 02115",
        fee: "$150 per session",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Psychiatrist",
        degree: "MD Psychiatry, Johns Hopkins University",
        experience: "12 years of experience",
        availability: "Tue-Thu: 10AM - 6PM, Fri: 1PM - 5PM",
        contact: "+1 (555) 987-6543",
        location: "456 Mind Ave, New York, NY 10001",
        fee: "$200 per session",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Dr. Aisha Rahman",
        specialty: "Counseling Psychologist",
        degree: "MA in Counseling Psychology, Columbia University",
        experience: "8 years of experience",
        availability: "Mon-Wed-Fri: 8AM - 4PM",
        contact: "+1 (555) 456-7890",
        location: "789 Harmony Lane, Los Angeles, CA 90001",
        fee: "$120 per session",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Dr. David Wilson",
        specialty: "Child Psychologist",
        degree: "PhD in Child Psychology, Stanford University",
        experience: "10 years of experience",
        availability: "Mon-Tue-Wed: 9AM - 3PM",
        contact: "+1 (555) 789-0123",
        location: "321 Growth Blvd, Chicago, IL 60601",
        fee: "$180 per session",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Dr. Emily Parker",
        specialty: "Marriage & Family Therapist",
        degree: "LMFT, University of Southern California",
        experience: "7 years of experience",
        availability: "Tue-Thu-Sat: 10AM - 6PM",
        contact: "+1 (555) 234-5678",
        location: "654 Relationship Rd, San Francisco, CA 94102",
        fee: "$130 per session",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Dr. James Rodriguez",
        specialty: "Neuropsychologist",
        degree: "PhD in Neuropsychology, Yale University",
        experience: "14 years of experience",
        availability: "Mon-Wed-Fri: 8AM - 5PM",
        contact: "+1 (555) 345-6789",
        location: "987 Brain St, Houston, TX 77001",
        fee: "$220 per session",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
];

// DOM Elements
const doctorsContainer = document.getElementById('doctorsContainer');
const doctorModal = document.getElementById('doctorModal');
const closeModal = document.querySelector('.close-modal');
const btnClose = document.querySelector('.btn-close');

// Display Doctors
function displayDoctors(doctorsToDisplay = doctors) {
    doctorsContainer.innerHTML = '';
    
    doctorsToDisplay.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        doctorCard.innerHTML = `
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
            <div class="doctor-info">
                <h3 class="doctor-name">${doctor.name}</h3>
                <p class="doctor-specialty">${doctor.specialty}</p>
                <div class="doctor-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${doctor.location.split(',')[0]}</span>
                </div>
                <button class="view-btn" data-id="${doctor.id}">View Profile</button>
            </div>
        `;
        doctorsContainer.appendChild(doctorCard);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const doctorId = parseInt(this.getAttribute('data-id'));
            const doctor = doctors.find(d => d.id === doctorId);
            openModal(doctor);
        });
    });
}

// Open Modal with Doctor Details
function openModal(doctor) {
    document.getElementById('modalDoctorImage').src = doctor.image;
    document.getElementById('modalDoctorName').textContent = doctor.name;
    document.getElementById('modalDoctorSpecialty').textContent = doctor.specialty;
    document.getElementById('modalDoctorDegree').textContent = doctor.degree;
    document.getElementById('modalDoctorExperience').textContent = doctor.experience;
    document.getElementById('modalDoctorAvailability').textContent = doctor.availability;
    document.getElementById('modalDoctorContact').textContent = doctor.contact;
    document.getElementById('modalDoctorLocation').textContent = doctor.location;
    document.getElementById('modalDoctorFee').textContent = doctor.fee;
    
    doctorModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModalFunc() {
    doctorModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
closeModal.addEventListener('click', closeModalFunc);
btnClose.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => {
    if (e.target === doctorModal) {
        closeModalFunc();
    }
});

// Search and Filter Functionality
document.querySelector('.search-box input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredDoctors = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm) || 
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.location.toLowerCase().includes(searchTerm)
    );
    displayDoctors(filteredDoctors);
});

document.getElementById('specialization').addEventListener('change', function() {
    const specialization = this.value.toLowerCase();
    if (!specialization) {
        displayDoctors();
        return;
    }
    const filteredDoctors = doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialization)
    );
    displayDoctors(filteredDoctors);
});

document.getElementById('location').addEventListener('change', function() {
    const location = this.value.toLowerCase();
    if (!location) {
        displayDoctors();
        return;
    }
    const filteredDoctors = doctors.filter(doctor => 
        doctor.location.toLowerCase().includes(location)
    );
    displayDoctors(filteredDoctors);
});

// Initialize
document.addEventListener('DOMContentLoaded', displayDoctors);