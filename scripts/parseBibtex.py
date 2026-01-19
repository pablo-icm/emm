#! /usr/bin/python
  
__version__ = "0.1"
import argparse
import os
import bibtexparser
from bibtexparser.bibdatabase import BibDatabase
from bibtexparser.bwriter import BibTexWriter
from pathlib import Path
import warnings
import re

# Get Options
parser = argparse.ArgumentParser(
    prog = "bitexParser4hugoWeb",
    description = '''Takes a bibTex record and parses it so as it is formatted in front matter for the EMM Hugo Website using the Research Group template.''',
    epilog = "Written by Pablo Sanchez, 2024. ICM-CSIC")
parser.add_argument('-i', '--infile',
                    nargs='?',
                    type=argparse.FileType('r'),
                    #default=sys.stdin,
                    help = "File name of a bibTex formatted SINGLE record.",
                    metavar = "file_name",
                    required=True)
parser.add_argument("-v", "--version", help = "Version", action='version', version="%(prog)s " + __version__)
args = parser.parse_args()

# Custom formatter to suppress default message details
def custom_formatwarning(msg, category, filename, lineno, line=None):
    return f"{msg}\n"  # Only show the warning message
warnings.formatwarning = custom_formatwarning

def parse_bibtex(bibtexItem, bibtexValue, key):
	if bibtexValue is None:
		pass
	else:
		outLine = bibtexItem + ': "' + bibtexValue + '"'
		outLineClean = re.sub("{|}", "", outLine)
		printOut(outLineClean)
	return

def parse_authors(bibtexAuthor, authorBib, key):
	if authorBib is None:
		pass
	else:
		authorArray = authorBib.split(" and ")
		for fullName in authorArray:
			firstName = fullName.split(", ")[1]
			lastName = fullName.split(", ")[0]
			printOut("- " + firstName + " " + lastName)
	return

def parse_journal(bibtexJournal, journalBib, key):
	if journalBib is None:
		pass
	else:
		outLine = 'publication: "*' + journalBib + '*"'
		printOut(outLine)
	return

def parse_keywords(bibtexKey, keyBib, key):
	if keyBib is None:
		pass
	else:
		keyArray = keyBib.split(", ")
		for keyword in keyArray:
			printOut('- ' + '"' + keyword + '"')
	return

def printOut(outLine):
	outputFile.write(outLine + "\n")
def printOutCite(item, itemName, key):
	if item is None:
		warnings.warn("File processed with WARNINGS:")
		print("bibtex field " +itemName +  " is missing from " + key)
	else:
		citeOutput = "    " + itemName + " = {" + item + "},\n"
		outputCiteFile.write(citeOutput)
	
def removeEscapeChars(bibtexValue):
	if bibtexValue is None: 
		pass
	else:
		escapeFreeString = re.sub(r"\\", "", bibtexValue)
		return escapeFreeString

# Load BibTeX file
with args.infile as infile:
  bib_database = bibtexparser.load(infile)
  for entry in bib_database.entries:
    key = entry.get('ID')
    author = entry.get('author')
    title = removeEscapeChars(entry.get('title'))
    abstract = removeEscapeChars(entry.get('abstract'))
    journal = removeEscapeChars(entry.get('journal'))
    doi = entry.get('doi')
    number = entry.get('number')
    volume = entry.get('volume')
    pages = entry.get('pages')
    url = entry.get('url')
    urldate = entry.get('urldate')
    year = entry.get('year')
    month = entry.get('month')
    language = entry.get('language')
    issn = entry.get('issn')
    keywords = removeEscapeChars(entry.get('keywords'))

    # Set the output path to index.md
    outputDir = key
    Path(outputDir).mkdir(exist_ok=True)
    outputFilePath = os.path.join(outputDir, "index.md")
    outputCiteFilePath = os.path.join(outputDir, "cite.bib")

    # Build a date as in YYYY-MM-DD as we only need the year and Hugo  complains if month and day is missing
    date=year + '-01-01'

    # Write cite.bib file
    with open(outputCiteFilePath, "w") as outputCiteFile:
        outputCiteFile.write('@article{'+key + ',\n')
        printOutCite(title, "title", key)
        printOutCite(author, "author", key)
        printOutCite(abstract, "abstract", key)
        printOutCite(journal, "journal", key)
        printOutCite(doi, "doi", key)
        printOutCite(number, "number", key)
        printOutCite(volume, "volume", key)
        printOutCite(pages, "pages", key)
        printOutCite(url, "url", key)
        printOutCite(urldate, "urldate", key)
        printOutCite(keywords, "keywords", key)
        outputCiteFile.write('    year = { '+ year + '}\n')
        outputCiteFile.write('}')

    with open(outputFilePath, "w") as outputFile:
    	printOut("---")
    	parse_bibtex("title", title, key)
    	printOut("authors:")
    	parse_authors("author", author, key)
    	parse_bibtex("date", date, key)
    	printOut("publication_types:")
    	printOut("- article-journal")
    	parse_journal("journal", journal, key)
    	if volume:
    		parse_bibtex("volume", volume, key)
    	if number:
    		parse_bibtex("number", number, key)
    	if pages:
    		parse_bibtex("pages", pages, key)
    	parse_bibtex("doi", doi, key)
    	if abstract:
    		parse_bibtex("abstract", abstract, key)
    	if keywords:
    		printOut("tags:")
    		parse_keywords("keywords", keywords, key)
    	if url:
    		printOut("links:")
    		printOut("- name: URL")
    		printOut('  url: "' + url + '"') 
    	printOut("---")
