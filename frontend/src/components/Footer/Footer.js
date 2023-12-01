import "./Footer.css";

export default function Footer() {

const handleLinkedin = (e) => {
    e.preventDefault();
    window.open('https://www.linkedin.com/in/miroslawa-borkowska-3b72332a0/');
};


return (
    <div id="footer-container">
        <div className="creator-div">
        <div className="creator">
            <div className="creator-text">Developer: ©2023 MiroslawaBorkowska™</div>
            <a
            href="https://github.com/Mirabordem"
            target="_blank"
            rel="noopener noreferrer"
            >
            <i className="fab fa-github creator-link-icon"></i>
            </a>
            <i class="fa-brands fa-linkedin footer-icon" onClick={handleLinkedin}></i>
        </div>
        </div>
    </div>
    );
}
