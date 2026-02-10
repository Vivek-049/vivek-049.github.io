// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Fetch GitHub Projects
async function fetchGitHubProjects() {
    const username = 'vivek-049';
    const projectsContainer = document.getElementById('github-projects');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        
        const repos = await response.json();
        
        if (repos.length === 0) {
            projectsContainer.innerHTML = `
                <div class="loading">
                    <p>No projects found yet. Start building and they'll appear here!</p>
                </div>
            `;
            return;
        }
        
        projectsContainer.innerHTML = '';
        
        repos.forEach(repo => {
            if (!repo.fork) { // Skip forked repos
                const projectCard = createProjectCard(repo);
                projectsContainer.appendChild(projectCard);
            }
        });
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsContainer.innerHTML = `
            <div class="loading">
                <p>Unable to load projects. Please check back later.</p>
            </div>
        `;
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const languageColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Ruby': '#701516',
        'PHP': '#4F5D95',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Shell': '#89e051',
        'Jupyter Notebook': '#DA5B0B',
        'default': '#8b949e'
    };
    
    const languageColor = languageColors[repo.language] || languageColors['default'];
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${repo.name}</h3>
            <p class="project-description">${repo.description || 'No description available'}</p>
        </div>
        <div class="project-footer">
            <div class="project-language">
                ${repo.language ? `
                    <span class="language-dot" style="background-color: ${languageColor}"></span>
                    <span>${repo.language}</span>
                ` : ''}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
                    <i class="fab fa-github"></i>
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    // Fetch GitHub projects
    fetchGitHubProjects();
    
    // Set up scroll animations
    const animatedElements = document.querySelectorAll('.stat-card, .skill-category, .contact-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Add active state to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});
