export const slugify = (str: string, opts: {
    randomSuffix?: boolean
} = {
        randomSuffix: false,
    }) => {
    // Replace spaces with dashes
    let slug = str.toLowerCase().replace(/ /g, '-')

    // Change Turkish characters
    slug = slug.replace(/ğ/g, 'g')
    slug = slug.replace(/ı/g, 'i')
    slug = slug.replace(/ş/g, 's')
    slug = slug.replace(/ü/g, 'u')
    slug = slug.replace(/ö/g, 'o')
    slug = slug.replace(/ç/g, 'c')

    // Remove special characters
    slug = slug.replace(/[^a-z0-9]/g, '-')

    // Remove multiple dashes
    slug = slug.replace(/-+/g, '-')

    // Remove trailing dash
    slug = slug.replace(/-$/, '')

    // Remove leading dash
    slug = slug.replace(/^-/, '')

    if (opts.randomSuffix) {
        // Add a random suffix (7 characters) to the slug
        slug = slug + '-' + Math.random().toString(36).substring(2, 9)
    }

    return slug
}
