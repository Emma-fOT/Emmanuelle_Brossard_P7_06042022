import "../styles/Home.css";

export default function Home() {
  return (
    <main className="home">
      <div className="home_banner">
        <h1 className="home_banner_title">Bienvenue sur notre réseau social interne</h1>
        <h2 className="home_banner_subtitle">Connecte-toi pour commencer à échanger avec tes collègues !</h2>
        <p className="home_login">
          <a href="/login">Se connecter</a>
        </p>
        <p className="home_signup">
          Pas encore de compte ?<br />
          <a href="/signup">Inscris-toi</a> !
        </p>
      </div>
    </main>
  );
}
