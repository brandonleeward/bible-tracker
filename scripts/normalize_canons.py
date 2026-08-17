import json
import os

# Base Protestant 66 Books
PROTESTANT_OT = [
    ("gen", "Genesis", "Pentateuch", 50),
    ("exo", "Exodus", "Pentateuch", 40),
    ("lev", "Leviticus", "Pentateuch", 27),
    ("num", "Numbers", "Pentateuch", 36),
    ("deu", "Deuteronomy", "Pentateuch", 34),
    ("jos", "Joshua", "Historical Books", 24),
    ("jdg", "Judges", "Historical Books", 21),
    ("rut", "Ruth", "Historical Books", 4),
    ("1sa", "1 Samuel", "Historical Books", 31),
    ("2sa", "2 Samuel", "Historical Books", 24),
    ("1ki", "1 Kings", "Historical Books", 22),
    ("2ki", "2 Kings", "Historical Books", 25),
    ("1ch", "1 Chronicles", "Historical Books", 29),
    ("2ch", "2 Chronicles", "Historical Books", 36),
    ("ezr", "Ezra", "Historical Books", 10),
    ("neh", "Nehemiah", "Historical Books", 13),
    ("est", "Esther", "Historical Books", 10), # Protestant Esther is 10 chapters
    ("job", "Job", "Wisdom", 42),
    ("psa", "Psalms", "Wisdom", 150),
    ("pro", "Proverbs", "Wisdom", 31),
    ("ecc", "Ecclesiastes", "Wisdom", 12),
    ("sng", "Song of Solomon", "Wisdom", 8),
    ("isa", "Isaiah", "Major Prophets", 66),
    ("jer", "Jeremiah", "Major Prophets", 52),
    ("lam", "Lamentations", "Major Prophets", 5),
    ("ezk", "Ezekiel", "Major Prophets", 48),
    ("dan", "Daniel", "Major Prophets", 12), # Protestant Daniel is 12 chapters
    ("hos", "Hosea", "Minor Prophets", 14),
    ("jol", "Joel", "Minor Prophets", 3),
    ("amo", "Amos", "Minor Prophets", 9),
    ("oba", "Obadiah", "Minor Prophets", 1),
    ("jon", "Jonah", "Minor Prophets", 4),
    ("mic", "Micah", "Minor Prophets", 7),
    ("nam", "Nahum", "Minor Prophets", 3),
    ("hab", "Habakkuk", "Minor Prophets", 3),
    ("zep", "Zephaniah", "Minor Prophets", 3),
    ("hag", "Haggai", "Minor Prophets", 2),
    ("zec", "Zechariah", "Minor Prophets", 14),
    ("mal", "Malachi", "Minor Prophets", 4)
]

NT_BOOKS = [
    ("mat", "Matthew", "Gospels", 28),
    ("mrk", "Mark", "Gospels", 16),
    ("luk", "Luke", "Gospels", 24),
    ("jhn", "John", "Gospels", 21),
    ("act", "Acts", "History", 28),
    ("rom", "Romans", "Pauline Epistles", 16),
    ("1co", "1 Corinthians", "Pauline Epistles", 16),
    ("2co", "2 Corinthians", "Pauline Epistles", 13),
    ("gal", "Galatians", "Pauline Epistles", 6),
    ("eph", "Ephesians", "Pauline Epistles", 6),
    ("php", "Philippians", "Pauline Epistles", 4),
    ("col", "Colossians", "Pauline Epistles", 4),
    ("1th", "1 Thessalonians", "Pauline Epistles", 5),
    ("2th", "2 Thessalonians", "Pauline Epistles", 3),
    ("1ti", "1 Timothy", "Pauline Epistles", 6),
    ("2ti", "2 Timothy", "Pauline Epistles", 4),
    ("tit", "Titus", "Pauline Epistles", 3),
    ("phm", "Philemon", "Pauline Epistles", 1),
    ("heb", "Hebrews", "General Epistles", 13),
    ("jas", "James", "General Epistles", 5),
    ("1pe", "1 Peter", "General Epistles", 5),
    ("2pe", "2 Peter", "General Epistles", 3),
    ("1jn", "1 John", "General Epistles", 5),
    ("2jn", "2 John", "General Epistles", 1),
    ("3jn", "3 John", "General Epistles", 1),
    ("jud", "Jude", "General Epistles", 1),
    ("rev", "Revelation", "Apocalyptic", 22)
]

DEUTEROCANONICALS = [
    ("tob", "Tobit", "Historical Books", 14),
    ("jdt", "Judith", "Historical Books", 16),
    ("1ma", "1 Maccabees", "Historical Books", 16),
    ("2ma", "2 Maccabees", "Historical Books", 15),
    ("wis", "Wisdom", "Wisdom", 19),
    ("sir", "Sirach", "Wisdom", 51),
    ("bar", "Baruch", "Major Prophets", 6)
]

ORTHODOX_ADDITIONS = [
    ("1es", "1 Esdras", "Historical Books", 9),
    ("3ma", "3 Maccabees", "Historical Books", 7),
    ("man", "Prayer of Manasseh", "Wisdom", 1),
    ("ps151", "Psalm 151", "Wisdom", 1)
]

def build_book(id, name, testament, section, chapterCount, isSupplementary=False):
    return {
        "id": id,
        "name": name,
        "testament": testament,
        "section": section,
        "chapterCount": chapterCount,
        "isSupplementary": isSupplementary
    }

def get_protestant_canon():
    books = []
    for id, name, section, chap in PROTESTANT_OT:
        books.append(build_book(id, name, "OT", section, chap))
    for id, name, section, chap in NT_BOOKS:
        books.append(build_book(id, name, "NT", section, chap))
    return books

def get_catholic_canon():
    books = []
    # Catholic OT interleaves Deuterocanonicals
    # Let's just insert them in traditional Catholic order, or append after.
    # Traditional order: Gen-Neh, Tobit, Judith, Esther(16), Job-Sng, Wis, Sir, Isa, Jer, Lam, Bar, Ezk, Dan(14), Minor Prophets, 1-2 Mac
    
    # We will build a dictionary to easily modify standard books
    ot_dict = { b[0]: list(b) for b in PROTESTANT_OT }
    # Modify Esther and Daniel for Catholic canon
    ot_dict["est"][3] = 16
    ot_dict["dan"][3] = 14
    
    catholic_ot_order = [
        "gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa",
        "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "tob", "jdt", "est", "1ma", "2ma",
        "job", "psa", "pro", "ecc", "sng", "wis", "sir", "isa", "jer", "lam",
        "bar", "ezk", "dan", "hos", "jol", "amo", "oba", "jon", "mic", "nam",
        "hab", "zep", "hag", "zec", "mal"
    ]
    
    deut_dict = { b[0]: list(b) for b in DEUTEROCANONICALS }
    all_ot = {**ot_dict, **deut_dict}
    
    for book_id in catholic_ot_order:
        b = all_ot[book_id]
        books.append(build_book(b[0], b[1], "OT", b[2], b[3], isSupplementary=False))
        
    for id, name, section, chap in NT_BOOKS:
        books.append(build_book(id, name, "NT", section, chap))
        
    return books

def get_orthodox_canon():
    books = []
    # Orthodox includes everything in Catholic + a few more
    # Order varies, but usually 1 Esdras before Ezra, 3 Mac after 2 Mac, Prayer of Manasseh often appended, Ps 151 after Ps 150
    # Let's build off Catholic but add the Orthodox ones
    
    ot_dict = { b[0]: list(b) for b in PROTESTANT_OT }
    # Orthodox also uses longer Esther (16) and Daniel (14) typically. Some use 151 for Psalms. We'll add Ps 151 as a separate book.
    ot_dict["est"][3] = 16
    ot_dict["dan"][3] = 14
    
    deut_dict = { b[0]: list(b) for b in DEUTEROCANONICALS }
    orth_dict = { b[0]: list(b) for b in ORTHODOX_ADDITIONS }
    all_ot = {**ot_dict, **deut_dict, **orth_dict}
    
    orthodox_ot_order = [
        "gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa",
        "1ki", "2ki", "1ch", "2ch", "1es", "ezr", "neh", "tob", "jdt", "est", 
        "1ma", "2ma", "3ma", "psa", "ps151", "man", "job", "pro", "ecc", "sng", "wis", "sir", 
        "isa", "jer", "lam", "bar", "ezk", "dan", "hos", "jol", "amo", "oba", 
        "jon", "mic", "nam", "hab", "zep", "hag", "zec", "mal"
    ]
    
    for book_id in orthodox_ot_order:
        b = all_ot[book_id]
        # In this dataset, none of these are 'supplementary' to an Orthodox reader since they are part of their standard Bible.
        books.append(build_book(b[0], b[1], "OT", b[2], b[3], isSupplementary=False))
        
    for id, name, section, chap in NT_BOOKS:
        books.append(build_book(id, name, "NT", section, chap))
        
    return books

def main():
    protestant = get_protestant_canon()
    catholic = get_catholic_canon()
    orthodox = get_orthodox_canon()
    
    os.makedirs("src/data", exist_ok=True)
    
    with open("src/data/protestant.json", "w") as f:
        json.dump(protestant, f, indent=2)
    
    with open("src/data/catholic.json", "w") as f:
        json.dump(catholic, f, indent=2)
        
    with open("src/data/orthodox.json", "w") as f:
        json.dump(orthodox, f, indent=2)
        
    print(f"Generated protestant.json with {len(protestant)} books.")
    print(f"Generated catholic.json with {len(catholic)} books.")
    print(f"Generated orthodox.json with {len(orthodox)} books.")

if __name__ == "__main__":
    main()
