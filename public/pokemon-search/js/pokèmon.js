const { useState, useEffect } = React;

function PokemonApp() {
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchPokemon = async () => {
    if (!search.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase().trim()}`
      );

      if (!response.ok) {
        throw new Error('Pokémon not found! Try a different name or ID.');
      }

      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchPokemon();
    }
  };

  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };

    return typeColors[type] || '#68A090';
  };

  const formatStatName = (statName) => {
    return statName.replace('-', ' ').replace('special', 'sp.');
  };

  const getStatPercentage = (baseStat) => {
    // Assuming max stat is around 255 for percentage calculation
    return Math.min((baseStat / 255) * 100, 100);
  };

  return (
    <div className="main-container">
      <header className="header">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1>
                <i className="fas fa-code me-3"></i>
                Pokédex Search
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="search-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="search-card">
                <div className="input-group input-group-lg">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Pokémon name or ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn btn-search"
                    type="button"
                    onClick={searchPokemon}
                    disabled={loading}
                  >
                    <i className="fas fa-search me-2"></i>
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">
                  <i className="fas fa-search me-2"></i>
                  Searching for Pokémon...
                </div>
              </div>
            )}

            {error && (
              <div className="error-alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {pokemon && (
              <div className="pokemon-card">
                <div className="pokemon-header">
                  <h2 className="pokemon-name">{pokemon.name}</h2>
                  <div className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</div>
                </div>

                <div className="pokemon-image-container">
                  <div className="pokemon-image">
                    <img
                      src={
                        pokemon.sprites.other['official-artwork'].front_default ||
                        pokemon.sprites.front_default
                      }
                      alt={pokemon.name}
                    />
                  </div>
                </div>

                <div className="px-4">
                  <div className="types-container">
                    {pokemon.types.map((typeInfo, index) => (
                      <span
                        key={index}
                        className="type-badge"
                        style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
                      >
                        {typeInfo.type.name}
                      </span>
                    ))}
                  </div>

                  <div className="details-grid">
                    <div className="detail-card">
                      <div className="detail-label">Height</div>
                      <div className="detail-value">{(pokemon.height / 10).toFixed(1)} m</div>
                    </div>
                    <div className="detail-card">
                      <div className="detail-label">Weight</div>
                      <div className="detail-value">{(pokemon.weight / 10).toFixed(1)} kg</div>
                    </div>
                    <div className="detail-card">
                      <div className="detail-label">Base Exp</div>
                      <div className="detail-value">{pokemon.base_experience || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className="stats-section">
                  <h3 className="stats-title">
                    <i className="fas fa-chart-bar me-2"></i>
                    Base Stats
                  </h3>
                  <div className="stats-grid">
                    {pokemon.stats.map((stat, index) => (
                      <div key={index} className="stat-item">
                        <div className="stat-header">
                          <span className="stat-name">{formatStatName(stat.stat.name)}</span>
                          <span className="stat-value">{stat.base_stat}</span>
                        </div>
                        <div className="stat-bar">
                          <div
                            className="stat-fill"
                            style={{
                              width: `${getStatPercentage(stat.base_stat)}%`,
                              animationDelay: `${index * 0.1}s`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!pokemon && !loading && !error && (
              <div className="instructions">
                <div className="instructions-icon"></div>
                <h3 className="mb-3">Welcome to Pokédex Search</h3>
                <p>Enter a Pokémon name or ID number to discover detailed information about your favorite Pokémon!</p>
                <p className="mb-0">
                  <strong>Examples:</strong> pikachu, charizard, 25, 150
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PokemonApp />);