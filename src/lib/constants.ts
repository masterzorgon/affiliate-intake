// Country to region mapping
export const countryToRegion: Record<string, string> = {
    // USA
    'United States': 'USA',
    // Europe
    'Albania': 'Europe', 'Andorra': 'Europe', 'Austria': 'Europe', 'Belarus': 'Europe',
    'Belgium': 'Europe', 'Bosnia and Herzegovina': 'Europe', 'Bulgaria': 'Europe',
    'Croatia': 'Europe', 'Cyprus': 'Europe', 'Czech Republic': 'Europe', 'Denmark': 'Europe',
    'Estonia': 'Europe', 'Finland': 'Europe', 'France': 'Europe', 'Germany': 'Europe',
    'Greece': 'Europe', 'Hungary': 'Europe', 'Iceland': 'Europe', 'Ireland': 'Europe',
    'Italy': 'Europe', 'Latvia': 'Europe', 'Liechtenstein': 'Europe', 'Lithuania': 'Europe',
    'Luxembourg': 'Europe', 'Malta': 'Europe', 'Moldova': 'Europe', 'Monaco': 'Europe',
    'Montenegro': 'Europe', 'Netherlands': 'Europe', 'North Macedonia': 'Europe',
    'Norway': 'Europe', 'Poland': 'Europe', 'Portugal': 'Europe', 'Romania': 'Europe',
    'Russia': 'Europe', 'San Marino': 'Europe', 'Serbia': 'Europe', 'Slovakia': 'Europe',
    'Slovenia': 'Europe', 'Spain': 'Europe', 'Sweden': 'Europe', 'Switzerland': 'Europe',
    'Ukraine': 'Europe', 'United Kingdom': 'Europe', 'Vatican City': 'Europe',
    // UAE
    'United Arab Emirates': 'UAE', 'Saudi Arabia': 'UAE', 'Qatar': 'UAE', 'Kuwait': 'UAE',
    'Bahrain': 'UAE', 'Oman': 'UAE',
    // LATAM
    'Argentina': 'LATAM', 'Bolivia': 'LATAM', 'Brazil': 'LATAM', 'Chile': 'LATAM',
    'Colombia': 'LATAM', 'Costa Rica': 'LATAM', 'Cuba': 'LATAM', 'Dominican Republic': 'LATAM',
    'Ecuador': 'LATAM', 'El Salvador': 'LATAM', 'Guatemala': 'LATAM', 'Honduras': 'LATAM',
    'Mexico': 'LATAM', 'Nicaragua': 'LATAM', 'Panama': 'LATAM', 'Paraguay': 'LATAM',
    'Peru': 'LATAM', 'Uruguay': 'LATAM', 'Venezuela': 'LATAM',
    // APAC
    'Afghanistan': 'APAC', 'Australia': 'APAC', 'Bangladesh': 'APAC', 'Bhutan': 'APAC',
    'Brunei': 'APAC', 'Cambodia': 'APAC', 'China': 'APAC', 'Fiji': 'APAC',
    'India': 'APAC', 'Indonesia': 'APAC', 'Japan': 'APAC', 'Laos': 'APAC',
    'Malaysia': 'APAC', 'Maldives': 'APAC', 'Myanmar': 'APAC', 'Nepal': 'APAC',
    'New Zealand': 'APAC', 'North Korea': 'APAC', 'Pakistan': 'APAC', 'Papua New Guinea': 'APAC',
    'Philippines': 'APAC', 'Singapore': 'APAC', 'South Korea': 'APAC', 'Sri Lanka': 'APAC',
    'Taiwan': 'APAC', 'Thailand': 'APAC', 'Vietnam': 'APAC',
};

// List of all countries sorted alphabetically
export const countries = Object.keys(countryToRegion).sort();

