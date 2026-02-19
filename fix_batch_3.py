import csv
import os

def fix_batch_3():
    file_path = '/home/gg/projects/nutrition_data/petsafe-validator/docs/data_sources/nutrients_data/nutrients_meta_batch_3.csv'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        lines = list(reader)

    # Line 12 (Organic Acids) - Correction
    L12 = ["177ad5db-cd70-4584-85b6-00b35258d417",
           "Organic acids dietary; includes citric, malic, tartaric, lactic; natural food preservatives; flavor compounds; digestive tract pH influence.",
           "Ácidos orgánicos dietéticos; incluye cítrico, málico, tartárico, láctico; conservantes alimentos naturales; compuestos sabor; influencia pH tracto digestivo.",
           "Acides organiques alimentaires; inclut citrique, malique, tartrique, lactique; conservateurs aliments naturels; composés saveur; influence pH tractus digestif.",
           "Органічні кислоти дієти; включає лимонну, яблучну, винну, молочну; природні консерванти їжі; ароматичні сполуки; влияние на pH травного тракту.",
           "Not established RDA; varied plant sources; citric acid primary; used food preservation, flavor; generally safe dietary amounts.",
           "No establecido RDA; fuentes plantas variadas; ácido cítrico primario; usado preservación alimentos, sabor; generalmente seguro cantidades dietéticas.",
           "Pas établi RDA; sources plantes variées; acide citrique primaire; utilisé préservation aliments, saveur; généralement sûr quantités alimentaires.",
           "Не встановлено RDA; різні рослинні джерела; лимонна кислота первинна; використовується при збереженні їжі, смак; загалом безпечна дієтична кількість.",
           "Not specifically required AAFCO; minor food preservation/flavoring; generally acceptable dietary component.",
           "No específicamente requerido AAFCO; preservación alimentos/sabor menor; componente dietético generalmente aceptable.",
           "Non spécifiquement requis AAFCO; préservation aliments/saveur mineure; composant alimentaire généralement acceptable.",
           "Не спеціально потрібна AAFCO; мала консервація їжі/смак; в цілому прийнятний компонент дієти.",
           "USDA FoodData Central https://fdc.nal.usda.gov",
           "NIH ODS; FDA Food Additives Status List",
           "AAFCO 2023; [source] Veterinary Nutrition Reviews",
           "EFSA Scientific Opinion Organic Acids https://www.efsa.europa.eu",
           "EFSA position dietary organic acids food preservation",
           "FEDIAF Pet Food Guidelines 2023"]

    # Replace Line 12 (index 11)
    lines[11] = L12
    
    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerows(lines)
    
    print("Batch 3 file Line 12 fixed.")

if __name__ == "__main__":
    fix_batch_3()
