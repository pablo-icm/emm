
# Scripts used to tweak things during the building of this website

awk one liner to get a field from tyhe cite.bib file and insert it at the end of the index.md on a publication

```bash
for dir in */; do
    if [ -f "${dir}cite.bib" ]; then
        pages=$(awk -F '[{},]' '/^ *pages *=/{for(i=1;i<=NF;i++) if($i ~ /[0-9A-Za-z]/) print $i}' "${dir}cite.bib" | sed 's/--/-/g' | tr -d ' ' | tr '\n' ' ' | sed 's/ $//' | sed 's/pages= //') # Clean up the pages variable
        if [ -n "$pages" ]; then
            awk -v pages="$pages" '
            BEGIN { in_front_matter = 1 }
            /^---/ {
                if (in_front_matter) {
                    in_front_matter = !in_front_matter
                } else {
                    print "pages: \x27" pages "\x27"
                }
            }
            { print }
            ' "${dir}index.md" > "${dir}index.tmp"
        fi
    fi
done

for dir in */; do
    if [ -f "${dir}cite.bib" ]; then
        # Extract pages, volume, and number from the cite.bib file
        pages=$(awk -F '[{},]' '/^ *pages *=/{for(i=1;i<=NF;i++) if($i ~ /[0-9A-Za-z]/) print $i}' "${dir}cite.bib" | sed 's/--/-/g' | tr -d ' ' | tr '\n' ' ' | sed 's/ $//' | sed 's/pages= //')
        volume=$(awk -F '[{},]' '/^ *volume *=/{for(i=1;i<=NF;i++) if($i ~ /[0-9A-Za-z]/) {gsub(/^[[:space:]]+|[[:space:]]+$/, "", $i); print $i}}' "${dir}cite.bib" | tr -d ' ' | tr '\n' ' ' | sed 's/ $//'| sed 's/volume= //')
        number=$(awk -F '[{},]' '/^ *number *=/{for(i=1;i<=NF;i++) if($i ~ /[0-9A-Za-z]/) {gsub(/^[[:space:]]+|[[:space:]]+$/, "", $i); print $i}}' "${dir}cite.bib" | tr -d ' ' | tr '\n' ' ' | sed 's/ $//'| sed 's/number= //')

        # Prepare the output for the front matter
        if [ -n "$pages" ] || [ -n "$volume" ] || [ -n "$number" ]; then
            awk -v pages="$pages" -v volume="$volume" -v number="$number" '
            BEGIN { in_front_matter = 1 }
            /^---/ {
                if (in_front_matter) {
                    in_front_matter = !in_front_matter
                } else {
                    # Print the fields if they exist
                    if (length(pages) > 0) print "pages: \x27" pages "\x27"
                    if (length(volume) > 0) print "volume: \x27" volume "\x27"
                    if (length(number) > 0) print "number: \x27" number "\x27"
                }
            }
            { print }
            ' "${dir}index.md" > "${dir}index.tmp"
            

            # Replace the original index.md with the updated one
            # mv "${dir}index.tmp" "${dir}index.md"
        fi
    fi
done
```



Coutinho, F. H., Silveira, C. B., Sebastián, M., Sánchez, P., Duarte, C. M., Vaqué, D., Gasol, J. M., & Acinas, S. G. (2023). Water mass age structures the auxiliary metabolic gene content of free-living and particle-attached deep ocean viral communities. Microbiome, 11(1), 118. https://doi.org/10.1186/s40168-023-01547-5


Perl oneliner to remove dots after initials in author names: 

```perl
perl -pe 's/^(- .*?)(\.\s)/$1 /g while /^- .*?\.\s/' content/publication/*/index.md

```