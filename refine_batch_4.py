import csv
import os

def refine_batch_4():
    file_path = '/home/gg/projects/nutrition_data/petsafe-validator/docs/data_sources/nutrients_data/nutrients_meta_batch_4.csv'
    
    # Refined data for Batch 4
    refined_data = []
    
    # 0: Header
    refined_data.append(["nutrient_id","definition_en","definition_es","definition_fr","definition_ua","value_human_en","value_human_es","value_human_fr","value_human_ua","value_animal_en","value_animal_es","value_animal_fr","value_animal_ua","source_usa_definition","source_usa_value_human","source_usa_value_animal","source_eu_definition","source_eu_value_human","source_eu_value_animal"])

    # 1: Protein (f24c...)
    refined_data.append(["f24cc4f1-7493-4619-bf7d-353d35e71226",
        "Organic macro-nutrient composed of amino acids; essential for tissue structure, immune function, and enzymatic reactions; primary source of nitrogen.",
        "Macronutriente orgánico compuesto de aminoácidos; esencial para la estructura de tejidos, función inmune y reacciones enzimáticas; fuente primaria de nitrógeno.",
        "Macronutriment organique composé d'acides aminés ; essentiel pour la structure des tissus, la fonction immunitaire et les réactions enzymatiques.",
        "Органічний макронутрієнт, що складається з амінокислот; важливий для структури тканин, імунної функції та ферментативних реакцій.",
        "RDA: 0.8 g/kg BW (~56 g for 70 kg adult); required for muscle maintenance, collagen synthesis, and immune antibodies.",
        "RDA: 0,8 g/kg PT (~56 g para adulto de 70 kg); requerido para mantenimiento muscular, síntesis de colágeno y anticuerpos.",
        "RDA : 0,8 g/kg PC (~56 g pour adulte de 70 kg) ; requis pour l'entretien musculaire, la synthèse du collagène et les anticorps.",
        "РНП: 0,8 г/кг ВТ (~56 г для дорослої людини 70 кг); необхідний для підтримки м'язів, синтезу колагену та імунних антитіл.",
        "AAFCO min: 18% DM (dogs), 26% DM (cats); cats are obligate carnivores requiring higher protein and specific amino acids like taurine.",
        "AAFCO mín: 18% MS (perros), 26% MS (gatos); los gatos son carnívoros estrictos que requieren mayor proteína y taurina.",
        "AAFCO min : 18% MS (chiens), 26% MS (chats) ; les chats sont des carnivores stricts nécessitant plus de protéines et de la taurine.",
        "AAFCO мін: 18% СР (собаки), 26% СР (коти); коти — облігатні хижаки, що потребують більше білка та специфічних амінокислот (таурин).",
        "USDA FoodData Central; NIH ODS", "National Academies DRI 2005; FDA Daily Value", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Protein https://www.efsa.europa.eu", "EFSA DRV protein (0.8 g/kg BW/day PRI)", "FEDIAF Pet Food Guidelines 2023"])

    # 2: Carbohydrates (54c6...)
    refined_data.append(["54c625b8-d81c-40f0-aced-c04c9be8cba6",
        "Digestible macronutrients including sugars and starches; primary energy source providing glucose for cellular function.",
        "Macronutrientes digeribles incluyendo azúcares y almidones; fuente de energía primaria que aporta glucosa para la función celular.",
        "Macronutriments digestibles incluant sucres et amidons ; source d'énergie primaire fournissant du glucose pour la fonction cellulaire.",
        "Травні макронутрієнти, включаючи цукри та крохмалі; первинне джерело енергії, що забезпечує глюкозу для клітинної функції.",
        "AMDR: 45-65% of daily calories; primary energy source for brain and muscles; dietary fiber supports gut health.",
        "AMDR: 45-65% de calorías diarias; fuente energía primaria para cerebro y músculos; fibra apoya salud intestinal.",
        "AMDR : 45-65 % des calories quotidiennes ; source d'énergie primaire pour le cerveau et les muscles ; les fibres soutiennent la santé intestinale.",
        "Діапазон: 45-65% добових калорій; первинне джерело енергії для мозку та м'язів; клітчатка підтримує здоров'я кишечника.",
        "No minimal AAFCO requirement for carbohydrates, but starch provides energy and structural integrity to kibble; cats utilize glucose efficiently via gluconeogenesis.",
        "Sin requisito mínimo AAFCO para carbohidratos, pero el almidón aporta energía y estructura a las croquetas.",
        "Pas d'exigence AAFCO minimale pour les glucides, mais l'amidon fournit de l'énergie et une structure aux croquettes.",
        "Мінімальні вимоги AAFCO для вуглеводів відсутні, але крохмаль забезпечує енергію та структуру сухого корму.",
        "USDA FoodData Central; NCBI Carbohydrate Biochemistry", "National Academies DRI 2005; FDA Guidelines", "AAFCO 2023; NRC 2006 Requirements",
        "EFSA Scientific Opinion Carbohydrates https://www.efsa.europa.eu", "EFSA recommendation carbohydrate energy balance", "FEDIAF Pet Food Guidelines 2023"])

    # 3: ME (kcal) (a49c...)
    refined_data.append(["a49c0419-01a0-4e1d-901b-41f536dd551e",
        "Metabolizable Energy (ME) in kcal; calculated via modified Atwater or Jones factors adjusted for digestibility.",
        "Energía metabolizable (EM) en kcal; calculada mediante factores de Atwater modificados o Jones ajustados por digestibilidad.",
        "Énergie métabolisable (EM) en kcal ; calculée via les facteurs Atwater modifiés ou Jones ajustés pour la digestibilité.",
        "Метаболізуюча енергія (МЕ) в ккал; розраховується за допомогою модифікованих факторів Етвотера або Джонса.",
        "Standard: 2000-2500 kcal/day for adults; basis for energy density and portion control.",
        "Estándar: 2000-2500 kcal/día para adultos; base para densidad energética y control de porciones.",
        "Standard : 2000-2500 kcal/jour pour adultes ; base pour la densité énergétique et le contrôle des portions.",
        "Стандарт: 2000-2500 ккал/день для дорослих; основа для енергетичної щільності та контролю порцій.",
        "Dogs: 70-100 kcal x (kg BW^0.75) for MER; Cats: 70-80 kcal x (kg BW^0.75) for MER; adjust for life stage and activity.",
        "Perros: 70-100 kcal x (kg PT^0,75) para REM; Gatos: 70-80 kcal x (kg PT^0,75) para REM; ajustar según etapa y actividad.",
        "Chiens : 70-100 kcal x (kg PC^0,75) pour BEM ; Chats : 70-80 kcal x (kg PC^0,75) pour BEM ; ajuster selon l'activité.",
        "Собаки: 70-100 ккал x (кг ВТ^0,75) для ПЕП; Коти: 70-80 ккал x (кг ВТ^0,75) для ПЕП; коригувати за стадією та активністю.",
        "USDA/NRC Metabolisable Energy; Atwater Factors", "FDA Daily Energy Value 2016; National Academies IOM", "NRC 2006 Requirements; AAFCO 2023",
        "EU Regulation 1169/2011 Methodology", "EFSA Scientific Opinion Energy https://www.efsa.europa.eu", "FEDIAF 2023 Nutritional Guidelines"])

    # 4: ME (kJ) (31dc...)
    refined_data.append(["31dc5abd-8271-4655-b972-60e032285c95",
        "Metabolizable energy in kilojoules (kJ); SI unit for energy work; 1 kcal = 4.184 kJ.",
        "Energía metabolizable en kilojulios (kJ); unidad SI para trabajo energético; 1 kcal = 4,184 kJ.",
        "Énergie métabolisable en kilojoules (kJ) ; unité SI pour l'énergie ; 1 kcal = 4,184 kJ.",
        "Метаболізуюча енергія в кілоджоулях (кДж); одиниця SI для енергетичної роботи; 1 ккал = 4,184 кДж.",
        "Reference: 8400-10500 kJ/day for adults; mandatory unit in many international regions including EU.",
        "Referencia: 8400-10500 kJ/día para adultos; unidad obligatoria en muchas regiones internacionales inclusive la UE.",
        "Référence : 8400-10500 kJ/jour pour adultes ; unité obligatoire dans de nombreuses régions dont l'UE.",
        "Довідка: 8400-10500 кДж/день для дорослих; обов'язкова одиниця в багатьох міжнародних регіонах, включаючи ЄС.",
        "Dogs: 292-419 kJ x (kg BW^0.75) for MER; Cats: 293-335 kJ x (kg BW^0.75) for MER.",
        "Perros: 292-419 kJ x (kg PT^0,75) para REM; Gatos: 293-335 kJ x (kg PT^0,75) para REM.",
        "Chiens : 292-419 kJ x (kg PC^0,75) pour BEM ; Chats : 293-335 kJ x (kg PC^0,75) pour BEM.",
        "Собаки: 292-419 кДж x (кг ВТ^0,75) для ПЕП; Коти: 293-335 кДж x (кг ВТ^0,75) для ПЕП.",
        "USDA FoodData Central; NIST SI Conversion Factors", "FDA Daily Energy Value converted 2016", "NRC 2006 Requirements; AAFCO 2023",
        "EU Regulation 1169/2011 SI Units mandated", "EFSA 2013 Energy Guidelines", "FEDIAF 2023 Nutritional Guidelines"])

    # 5: Energy per 100g (EU) (3611...)
    refined_data.append(["3611a9aa-3067-4a99-9efd-cebfbc29b309",
        "Energy content per 100g (EU standard); based on EU Reg. 1169/2011 factors for labeling compliance.",
        "Contenido energético por 100g (estándar UE); basado en factores de EU Reg. 1169/2011 para etiquetado.",
        "Contenu énergétique pour 100g (norme UE) ; basé sur les facteurs du Règl. UE 1169/2011 pour l'étiquetage.",
        "Вміст енергії на 100 г (стандарт ЄС); на основі коефіцієнтів EU Reg. 1169/2011 для маркування.",
        "Factors: Protein/Carbs 17 kJ/g, Fat 37 kJ/g, Fiber 8 kJ/g; used for official European nutrition declarations.",
        "Factores: Prot/Carbo 17 kJ/g, Grasa 37 kJ/g, Fibra 8 kJ/g; usado en declaraciones oficiales europeas.",
        "Facteurs : Prot/Glucides 17 kJ/g, Graisse 37 kJ/g, Fibres 8 kJ/g ; utilisé pour les déclarations européennes.",
        "Коефіцієнти: Білок/Вуглеводи 17 кДж/г, Жир 37 кДж/г, Клітчатка 8 кДж/г; для офіційних декларацій ЄС.",
        "EU pet food labeling requires declaration of energy content calculated via specific European methodologies (FEDIAF).",
        "El etiquetado de alimentos mascotas en UE requiere declaración de energía calculada por metodología FEDIAF.",
        "L'étiquetage UE des aliments pour animaux nécessite une déclaration d'énergie via la méthodologie FEDIAF.",
        "Маркування кормів ЄС вимагає декларації енергії, розрахованої за методиками FEDIAF.",
        "Commission Regulation (EU) No 1169/2011", "EU Labeling Guidelines; EFSA methodology", "AAFCO 2023 Nutrient Profiles; [source] FEDIAF Guidelines",
        "EFSA Scientific Opinion Energy https://www.efsa.europa.eu", "EFSA energy conversion factors 2009", "FEDIAF Pet Food Guidelines 2023 (EU Compliance)"])

    # 6: Energy kJ per 100g (EU) (2197...)
    refined_data.append(["2197d068-6ddb-4bbd-83e4-7b5d28b64572",
        "Energy in kilojoules (kJ) per EU standard; mandatory primary unit for European nutrition labels.",
        "Energía en kilojulios (kJ) según estándar UE; unidad primaria obligatoria para etiquetas europeas.",
        "Énergie en kilojoules (kJ) selon la norme UE ; unité primaire obligatoire pour les étiquettes de l'UE.",
        "Енергія в кілоджоулях (кДж) за стандартом ЄС; обов'язкова основна одиниця для європейських етикеток.",
        "Mandatory primary unit for all food labels in the EU; must be displayed alongside kcal per 100g or per portion.",
        "Unidad primaria obligatoria en UE; debe mostrarse junto a kcal por 100g o por porción.",
        "Unité primaire obligatoire dans l'UE ; doit être affichée avec les kcal pour 100g ou par portion.",
        "Обов'язкова основна одиниця в ЄС; має відображатися разом із ккал на 100 г або на порцію.",
        "Energy in kJ per 100g is the standard unit for European pet food labels per EU 1169/2011.",
        "Energía en kJ por 100g es la unidad estándar para etiquetas de alimentos mascotas en Europa.",
        "L'énergie en kJ pour 100g est l'unité standard pour les aliments animaux en Europe.",
        "Енергія в кДж на 100 г є стандартною одиницею для маркування кормів у Європі.",
        "Commission Regulation (EU) No 1169/2011", "EU Nutrition Labeling Rules", "AAFCO 2023 Nutrient Profiles; [source] FEDIAF Guidelines",
        "EFSA Scientific Opinion Energy https://www.efsa.europa.eu", "EFSA energy guidelines 2009", "FEDIAF Pet Food Guidelines 2023"])

    # 7: Lipids/Fats (04ed...)
    refined_data.append(["04ede2d1-ef3e-47a0-8e6c-8933f9da9e0f",
        "Dietary lipids including triglycerides and essential fatty acids; provides energy, supports cell membranes and fat-soluble vitamin absorption.",
        "Lípidos dietéticos incluyendo triglicéridos y ácidos grasos esenciales; aporta energía, apoya membranas celulares y absorción de vitaminas.",
        "Lipides alimentaires incluant triglycérides et acides gras essentiels ; fournit de l'énergie, soutient les membranes cellulaires.",
        "Дієтичні ліпіди, включаючи тригліцериди та основні жирні кислоти; забезпечує енергію, підтримує клітинні мембрани.",
        "AMDR: 20-35% of daily calories; essential for energy storage and provision of linoleic/alpha-linolenic acids.",
        "AMDR: 20-35% de calorías diarias; esencial para reserva de energía y provisión de ácidos linoleico/alfa-linolénico.",
        "AMDR : 20-35 % des calories quotidiennes ; essentiel pour le stockage de l'énergie et l'apport d'acides gras essentiels.",
        "Діапазон: 20-35% добових калорій; важливий для накопичення енергії та забезпечення лінолевої/альфа-ліноленової кислот.",
        "AAFCO min: 5% DM (dogs), 9% DM (cats); source of essential fatty acids (omega-3/6); supports skin/coat health and energy density.",
        "AAFCO mín: 5% MS (perros), 9% MS (gatos); fuente de ácidos grasos esenciales (omega-3/6); apoya salud de piel y pelo.",
        "AAFCO min : 5% MS (chiens), 9% MS (chats) ; source d'acides gras essentiels (oméga-3/6) ; soutient la santé de la peau et du pelage.",
        "AAFCO мін: 5% СР (собаки), 9% СР (коти); джерело основних жирних кислот (омега-3/6); підтримує здоров'я шкіри/шерсті.",
        "USDA FoodData Central; NIH ODS", "National Academies DRI 2005; FDA Daily Value", "AAFCO 2023 Nutrient Profiles; NRC 2006 Requirements",
        "EFSA Scientific Opinion Fats https://www.efsa.europa.eu", "EFSA DRVs 2010 (Fats/Fatty Acids)", "FEDIAF Pet Food Guidelines 2023"])

    # 8: Fiber (c3d4...)
    refined_data.append(["c3d4363f-4142-4aa5-88a7-0556a1448b13",
        "Indigestible plant carbohydrates (soluble/insoluble); promotes gut motility, satiety, and healthy microbiome fermentation.",
        "Carbohidratos vegetales indigeribles (solubles/insolubles); promueve motilidad intestinal, saciedad y fermentación saludable.",
        "Glucides végétaux indigestes ; favorise la motilité intestinale, la satiété et la fermentation du microbiome.",
        "Неперетравлювані рослинні вуглеводи (розчинні/нерозчинні); сприяють кишечній перистальтиці, насиченню та ферментації.",
        "AI: 25-38 g/day; supports digestive regularity, weight management, and healthy cholesterol levels.",
        "IA: 25-38 g/día; apoya regularidad digestiva, control de peso y niveles de colesterol saludables.",
        "IA : 25-38 g/jour ; soutient la régularité digestive, la gestion du poids et les niveaux de cholestérol.",
        "АД: 25-38 г/день; підтримує травну регулярність, контроль ваги та здоровий рівень холестерину.",
        "AAFCO max crude fiber common in diets (e.g. 5-10%); promotes digestive health and satiety; excessive fiber can reduce energy density.",
        "AAFCO máx fibra cruda común (5-10%); apoya salud digestiva y saciedad; exceso puede reducir densidad energética.",
        "AAFCO max fibre brute courant (5-10%) ; soutient la santé digestive et la satiété ; l'excès peut réduire la densité énergétique.",
        "AAFCO макс сирої клітчатки зазвичай 5-10%; підтримує травне здоров'я та насичення; надлишок може знизити енергетичну щільність.",
        "USDA FoodData Central; NIH Fiber Research", "National Academies DRI 2005; FDA Guidelines", "AAFCO 2023; NRC 2006 Requirements",
        "EFSA Scientific Opinion Fiber https://www.efsa.europa.eu", "EFSA DRV dietary fiber (25 g/day PRI)", "FEDIAF Pet Food Guidelines 2023"])

    # 9: Total Protein per 100g (e1f8...)
    refined_data.append(["e1f8d2d9-485e-4671-8f29-befcdbeb9e75",
        "Total protein content per 100g; sum of all amino acids representing the primary building blocks of body tissues.",
        "Contenido de proteína total por 100g; suma de todos los aminoácidos, bloques de construcción primarios del cuerpo.",
        "Teneur en protéines totales pour 100g ; somme de tous les acides aminés, constituants primaires des tissus.",
        "Загальний вміст протеїну на 100 г; сума всіх амінокислот, що є основними будівельними блоками тіла.",
        "Standardized per 100g for nutritional comparison; RDA based on 0.8 g/kg BW for adults.",
        "Estandarizado por 100g para comparación; RDA basado en 0,8 g/kg PT para adultos.",
        "Standardisé par 100g pour comparaison ; RDA basé sur 0,8 g/kg PC pour les adultes.",
        "Стандартизовано на 100 г для порівняння; РНП на основі 0,8 г/кг ВТ для дорослих.",
        "Essential for growth and maintenance in pets; required for enzymes, hormones, and immune response.",
        "Esencial para crecimiento y mantenimiento en mascotas; requerido para enzimas, hormonas y respuesta inmune.",
        "Essentiel pour la croissance et l'entretien des animaux ; requis pour les enzymes, les hormones et l'immunité.",
        "Важливо для росту та підтримки тварин; необхідний для ферментів, гормонів та імунної відповіді.",
        "USDA FoodData Central; Kjeldahl methodology", "National Academies DRI 2005; FDA Guidelines", "AAFCO 2023; NRC 2006 Requirements",
        "EFSA Scientific Opinion Protein https://www.efsa.europa.eu", "EFSA protein guidelines 2012", "FEDIAF Pet Food Guidelines 2023"])

    # 10: Crude Protein (1bc0...)
    refined_data.append(["1bc0137e-9a1d-464b-b622-0ec9726cf76a",
        "Crude protein estimate based on total nitrogen (N x 6.25); includes protein and non-protein nitrogen sources.",
        "Estimación de proteína cruda basada en nitrógeno total (N x 6,25); incluye fuentes de nitrógeno no proteico.",
        "Estimation de la protéine brute basée sur l'azote total (N x 6,25) ; inclut les sources d'azote non protéique.",
        "Оцінка сирого протеїну на основі загального азоту (N x 6,25); включає протеїнові та непротеїнові джерела азоту.",
        "Laboratory standard for nitrogen measurement; basis for food labeling but doesn't distinguish protein quality.",
        "Estándar de laboratorio para medición de nitrógeno; base para etiquetado pero no indica calidad de proteína.",
        "Norme de laboratoire pour la mesure de l'azote ; base pour l'étiquetage mais n'indique pas la qualité.",
        "Лабораторний стандарт для вимірювання азоту; основа для маркування, але не вказує на якість білка.",
        "Standard declaration for pet food labels; must meet AAFCO minimums (18% dogs, 26% cats).",
        "Declaración estándar para etiquetas alimentos mascotas; debe cumplir mínimos AAFCO (18% perros, 26% gatos).",
        "Déclaration standard pour l'étiquetage des aliments animaux ; doit respecter les minima AAFCO.",
        "Стандартна декларація для маркування кормів; має відповідати мінімумам AAFCO (18% собаки, 26% коти).",
        "USDA Official Crude Protein; Kjeldahl Standard", "AOAC Official Method 990.03", "AAFCO 2023 Official Publication",
        "EFSA methodology crude protein analysis", "ISO 16634-1:2008 (Total Nitrogen)", "FEDIAF Pet Food Guidelines 2023"])

    # 11: Water/Moisture (3e84...)
    refined_data.append(["3e849487-0e40-4392-ab02-ae919054fa3a",
        "Total water content (moisture); essential for temperature regulation, joint lubrication, and nutrient transport.",
        "Contenido de agua total (humedad); esencial para regulación de temperatura, lubricación de articulaciones y transporte de nutrientes.",
        "Teneur totale en eau (humidité) ; essentielle pour la régulation thermique et le transport des nutriments.",
        "Загальний вміст води (вологість); важливо для терморегуляції, змащування суглобів та транспорту поживних речовин.",
        "Reference: ~2-3 L/day for adults; primary component of body tissues (~60-70% total weight).",
        "Referencia: ~2-3 L/día para adultos; componente primario de tejidos corporales (~60-70% PT).",
        "Référence : ~2-3 L/jour pour les adultes ; composant primaire des tissus (~60-70 % poids total).",
        "Довідка: ~2-3 л/день для дорослих; основний компонент тканин тіла (~60-70% загальної ваги).",
        "Essential for pets; wet foods provide ~75-82% moisture, dry kibble ~8-12%; cats have low thirst drive and benefit from high moisture.",
        "Esencial para mascotas; comida húmeda aporta ~75-82% humedad; gatos tienen baja sensación de sed y se benefician de humedad alta.",
        "Essentiel pour les animaux ; la pâtée apporte ~75-82 % d'humidité ; les chats boivent peu et ont besoin d'humidité.",
        "Важливо для тварин; вологі корми забезпечують ~75-82% вологи; коти мають низьке відчуття спраги та потребують вологої їжі.",
        "USDA FoodData Central; NIST Water Properties", "National Academies DRI 2004 (Water)", "AAFCO 2023; NRC 2006 Requirements",
        "EFSA Scientific Opinion Water https://www.efsa.europa.eu", "EFSA DRVs 2010 (Water)", "FEDIAF Pet Food Guidelines 2023"])

    # 12: Bioavailable Phosphorus (e628...)
    refined_data.append(["e6281fed-3e7e-4ca7-87ca-4278f3f86f54",
        "Portion of total phosphorus that is digestible and available for metabolic functions like bone mineralization and ATP synthesis.",
        "Porción de fósforo total digerible y disponible para funciones metabólicas (mineralización ósea, síntesis ATP).",
        "Portion du phosphore total digestible et disponible pour les fonctions métaboliques (minéralisation osseuse, ATP).",
        "Частина загального фосфору, що перетравлюється та доступна для метаболічних функцій (мінералізація кісток, АТФ).",
        "Not standard for human labeling; focus is on total phosphorus intake vs RDA.",
        "No estándar para etiquetado humano; el enfoque es fósforo total vs RDA.",
        "Pas standard pour l'étiquetage humain ; l'accent est mis sur le phosphore total.",
        "Не стандарт для людського маркування; увага на загальний фосфор.",
        "Critical for pets; availability varies (plant phytate P is less available than animal sources); balance with calcium is vital.",
        "Crítico para mascotas; disponibilidad varía (fitato P vegetal es menos disponible); balance con calcio es vital.",
        "Critique pour les animaux ; la biodisponibilité varie (le phytate végétal est moins assimilable) ; l'équilibre avec le calcium est vital.",
        "Критично для тварин; доступність варіює (рослинний фітат P менш доступний); баланс з кальцієм життєво важливий.",
        "USDA FoodData Central; NRC Phosphorus Bioavailability", "NIH ODS Phosphorus", "AAFCO 2023; NRC 2006 Requirements",
        "EFSA Scientific Opinion Phosphorus https://www.efsa.europa.eu", "EFSA phosphorus feed evaluation", "FEDIAF Pet Food Guidelines 2023"])

    # 13: Calcium (73c4...)
    refined_data.append(["73c4a3e8-54a3-4521-b39e-dcdef0bea610",
        "Essential mineral for skeletal structure, muscle contraction, nerve transmission, and blood clotting.",
        "Mineral esencial para estructura esquelética, contracción muscular, transmisión nerviosa y coagulación sanguínea.",
        "Minéral essentiel pour la structure osseuse, la contraction musculaire, la transmission nerveuse et la coagulation sanguine.",
        "Важливий мінерал для структури кісток, скорочення м'язів, передачі нервів та згортання крові.",
        "RDA: 1000-1200 mg/day (adults); vital for bone density and long-term prevention of osteoporosis.",
        "RDA: 1000-1200 mg/día (adultos); vital para densidad ósea y prevención de osteoporosis.",
        "RDA : 1000-1200 mg/jour ; vital pour la densité osseuse et la prévention de l'ostéoporose.",
        "РНП: 1000-1200 мг/день (дорослі); важливо для щільності кісток та профілактики остеопорозу.",
        "AAFCO min: 0.6% DM (dogs), 0.6% (cats); strict Ca:P ratio (1:1 to 2:1) is critical to prevent skeletal deformities, especially in large breeds.",
        "AAFCO mín: 0,6% MS (perros/gatos); relación Ca:P estricta (1:1 a 2:1) es crítica para prevenir deformidades esqueléticas.",
        "AAFCO min : 0,6% MS (chiens/chats) ; le rapport Ca:P strict (1:1 à 2:1) est critique pour prévenir les déformations.",
        "AAFCO мін: 0,6% СР (собаки/коти); строге співвідношення Ca:P (1:1 до 2:1) критично важливе для профілактики деформацій скелета.",
        "USDA FoodData Central; NIH ODS Calcium", "National Academies DRI 2011 (Calcium)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Calcium https://www.efsa.europa.eu", "EFSA DRVs 2015 (Calcium)", "FEDIAF Pet Food Guidelines 2023"])

    # 14: Ca:P Ratio (3ed0...)
    refined_data.append(["3ed056d6-f031-4320-b5b5-fbf32b3ae4e9",
        "Calcium to Phosphorus ratio; metabolic indicator of mineral balance essential for healthy bone development.",
        "Relación Calcio-Fósforo; indicador metabólico de balance mineral esencial para desarrollo óseo saludable.",
        "Rapport Calcium-Phosphore ; indicateur métabolique de l'équilibre minéral essentiel pour le développement osseux.",
        "Співвідношення Кальцію та Фосфору; метаболічний показник мінерального балансу для здорового розвитку кісток.",
        "Human nutrition focuses on absolute values (RDA) rather than precise ratios, though balance remains important.",
        "Nutrición humana enfoca en valores absolutos (RDA) más que en relaciones precisas.",
        "La nutrition humaine se concentre sur les valeurs absolues (RDA) plutôt que sur les rapports précis.",
        "Людське харчування фокусується на абсолютних значеннях (РНП), а не на точних співвідношеннях.",
        "Ideal range: 1:1 to 2:1 for dogs, 1:1 to 1.5:1 for cats; imbalance leads to secondary hyperparathyroidism or skeletal disease.",
        "Rango ideal: 1:1 a 2:1 para perros, 1:1 a 1,5:1 para gatos; desbalance causa hiperparatiroidismo secundario.",
        "Plage idéale : 1:1 à 2:1 pour chiens ; l'équilibre prévient l'hyperparathyroïdie secondaire.",
        "Ідеальний діапазон: 1:1 до 2:1 для собак, 1:1 до 1,5:1 для котів; дисбаланс веде до гіперпаратиреозу.",
        "NRC 2006 Nutrient Requirements; AAFCO Standards", "National Academies DRI (Calcium/Phosphorus balance)", "AAFCO 2023 Nutrient Profiles",
        "EFSA Scientific Opinion Bone Mineral Metabolism", "EFSA feedback on mineral ratios", "FEDIAF Pet Food Guidelines 2023"])

    # 15: Chloride (0138...)
    refined_data.append(["0138cf2a-8fb0-4eff-bb3d-382819f14aa1",
        "Essential electrolyte for fluid balance, acid-base equilibrium, and production of gastric hydrochloric acid (HCl).",
        "Electrolito esencial para equilibrio de fluidos, equilibrio ácido-base y producción de ácido clorhídrico (HCl).",
        "Électrolyte essentiel pour l'équilibre hydrique, l'équilibre acido-basique et la production d'HCl gastrique.",
        "Важливий електроліт для балансу рідини, кислотно-лужної рівноваги та вироблення шлункового соку (HCl).",
        "AI: 2.3 g/day (adults); usually consumed as sodium chloride (salt); vital for cellular homeostasis.",
        "IA: 2,3 g/día (adultos); usualmente consumido como cloruro de sodio; vital para homeostasis celular.",
        "IA : 2,3 g/jour ; généralement consommé sous forme de sel ; vital pour l'homéostasie.",
        "АД: 2,3 г/день (дорослі); зазвичай споживається як хлорид натрію (сіль); важливо для гомеостазу.",
        "AAFCO min: 0.11% DM (dogs), 0.3% (cats); essential for palatability and metabolic regulation; deficiency leads to alkalosis.",
        "AAFCO mín: 0,11% MS (perros), 0,3% (gatos); esencial para palatabilidad; deficiencia causa alcalosis.",
        "AAFCO min : 0,11% MS (chiens), 0,3% (chats) ; essentiel pour l'appétence ; la carence cause l'alcalose.",
        "AAFCO мін: 0,11% СР (собаки), 0,3% (коти); важливо для смаку; дефіцит призводить до алкалозу.",
        "USDA FoodData Central; NIH ODS Chloride", "National Academies DRI 2005 (Electrolytes)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Chloride https://www.efsa.europa.eu", "EFSA DRVs 2019 (Chloride)", "FEDIAF Pet Food Guidelines 2023"])

    # 16: Copper (e2a4...)
    refined_data.append(["e2a4b18f-380f-4fc9-a76f-56d7ce96cd32",
        "Essential trace mineral; cofactor for enzymes in energy production, iron metabolism, and collagen synthesis.",
        "Mineral traza esencial; cofactor de enzimas en producción de energía, metabolismo de hierro y síntesis de colágeno.",
        "Oligo-élément essentiel ; cofacteur d'enzymes (production d'énergie, métabolisme du fer).",
        "Важливий мікроелемент; кофактор ферментів у виробленні енергії, метаболізмі заліза та синтезі колагену.",
        "RDA: 900 mcg/day; supports cardiovascular health, immunity, and prevention of anemia.",
        "RDA: 900 mcg/día; apoya salud cardiovascular, inmunidad y prevención de anemia.",
        "RDA : 900 mcg/jour ; soutient la santé cardiovasculaire et l'immunité.",
        "РНП: 900 мкг/день; підтримує здоров'я серцево-судинної системи та імунітет.",
        "AAFCO min: 7.3 mg/kg DM (dogs), 5.0 mg/kg (cats); deficiency leads to anemia and coat depigmentation; some breeds (Bedlingtons) prone to Cu toxicity.",
        "AAFCO mín: 7,3 mg/kg MS (perros), 5,0 mg/kg (gatos); deficiencia causa anemia y despigmentación de pelo.",
        "AAFCO min : 7,3 mg/kg MS (chiens) ; la carence cause l'anémie et la dépigmentation du poil.",
        "AAFCO мін: 7,3 мг/кг СР (собаки), 5,0 мг/кг (коти); дефіцит призводить до анемії та депігментації шерсті.",
        "USDA FoodData Central; NIH ODS Copper", "National Academies DRI 2001 (Copper)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Copper https://www.efsa.europa.eu", "EFSA DRVs 2015 (Copper)", "FEDIAF Pet Food Guidelines 2023"])

    # 17: Iodine (13eb...)
    refined_data.append(["13eb73f5-251f-4c9d-8c70-9dd24424f0c8",
        "Essential trace mineral; required for synthesis of thyroid hormones (T3, T4) regulating metabolism and growth.",
        "Mineral traza esencial; requerido para síntesis de hormonas tiroideas (T3, T4) que regulan metabolismo y crecimiento.",
        "Oligo-élément essentiel ; requis pour la synthèse des hormones thyroïdiennes.",
        "Важливий мікроелемент; необхідний для синтезу гормонів щитоподібної залози (T3, T4).",
        "RDA: 150 mcg/day; critical for cognitive function and metabolic rate; preventing goiter and cretinism.",
        "RDA: 150 mcg/día; crítico para función cognitiva y tasa metabólica; previene bocio.",
        "RDA : 150 mcg/jour ; critique pour la fonction cognitive et le métabolisme.",
        "РНП: 150 мкг/день; важливо для когнітивної функції та обміну речовин.",
        "AAFCO min: 1.0 mg/kg DM (dogs), 0.6 mg/kg (cats); both deficiency and excess lead to thyroid dysfunction (goiter/hyperthyroidism).",
        "AAFCO mín: 1,0 mg/kg MS (perros), 0,6 mg/kg (gatos); deficiencia y exceso causan disfunción tiroidea.",
        "AAFCO min : 1,0 mg/kg MS (chiens) ; la carence et l'excès causent des troubles thyroïdiens.",
        "AAFCO мін: 1,0 мг/кг СР (собаки), 0,6 мг/кг (коти); дефіцит та надлишок призводять до дисфункції щитоподібної залози.",
        "USDA FoodData Central; NIH ODS Iodine", "National Academies DRI 2001 (Iodine)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Iodine https://www.efsa.europa.eu", "EFSA DRVs 2014 (Iodine)", "FEDIAF Pet Food Guidelines 2023"])

    # 18: Iron (9153...)
    refined_data.append(["91531b65-9f33-4ea8-ac33-04205915e464",
        "Essential trace mineral; vital for oxygen transport (hemoglobin/myoglobin) and cellular energy production.",
        "Mineral traza esencial; vital para transporte de oxígeno (hemoglobina/mioglobina) y producción de energía celular.",
        "Oligo-élément essentiel ; vital pour le transport de l'oxygène (hémoglobine).",
        "Важливий мікроелемент; важливий для транспорту кисню (гемоглобін/міоглобін).",
        "RDA: 8 mg/day (men), 18 mg/day (women); essential for cognitive development and immune health.",
        "RDA: 8 mg/día (hombres), 18 mg/día (mujeres); esencial para desarrollo cognitivo y salud inmune.",
        "RDA : 8 mg/jour (hommes), 18 mg/jour (femmes) ; essentiel pour le développement cognitif.",
        "РНП: 8 мг/день (чоловіки), 18 мг/день (жінки); важливо для когнітивного розвитку.",
        "AAFCO min: 40 mg/kg DM (dogs), 80 mg/kg (cats); deficiency leads to anemia; excess (toxicity) is dangerous for pets.",
        "AAFCO mín: 40 mg/kg MS (perros), 80 mg/kg (gatos); deficiencia causa anemia; exceso es peligroso.",
        "AAFCO min : 40 mg/kg MS (chiens), 80 mg/kg MS (chats) ; la carence cause l'anémie.",
        "AAFCO мін: 40 мг/кг СР (собаки), 80 мг/кг (коти); дефіцит призводить до анемії; надлишок небезпечний.",
        "USDA FoodData Central; NIH ODS Iron", "National Academies DRI 2001 (Iron)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Iron https://www.efsa.europa.eu", "EFSA DRVs 2015 (Iron)", "FEDIAF Pet Food Guidelines 2023"])

    # 19: Magnesium (8e2d...)
    refined_data.append(["8e2d4d6c-7366-4ec9-896f-8bbc7e178fe9",
        "Essential mineral; cofactor for >300 enzymes; vital for ATP production, neuromuscular function, and bone structure.",
        "Mineral esencial; cofactor de >300 enzimas; vital para producción de ATP, función neuromuscular y estructura ósea.",
        "Minéral essentiel ; cofacteur de >300 enzymes ; vital pour la production d'ATP et la structure osseuse.",
        "Важливий мінерал; кофактор для >300 ферментів; важливий для вироблення АТФ та структури кісток.",
        "RDA: 310-420 mg/day; supports cardiovascular health, muscle relaxation, and glucose metabolism.",
        "RDA: 310-420 mg/día; apoya salud cardiovascular, relajación muscular y metabolismo de glucosa.",
        "RDA : 310-420 mg/jour ; soutient la santé cardiovasculaire et la relaxation musculaire.",
        "РНП: 310-420 мг/день; підтримує серцево-судинне здоров'я та розслаблення м'язів.",
        "AAFCO min: 0.04% DM (dogs), 0.04% (cats); important for heart and nerve health; restricted in some feline urolithiasis diets.",
        "AAFCO mín: 0,04% MS (perros/gatos); importante para salud cardíaca/nerviosa; restringido en dietas para urolitiasis felina.",
        "AAFCO min : 0,04% MS ; important pour le cœur ; limité dans les régimes pour urolithiase féline.",
        "AAFCO мін: 0,04% СР (собаки/коти); важливо для здоров'я серця; обмежується при сечокам'яній хворобі у котів.",
        "USDA FoodData Central; NIH ODS Magnesium", "National Academies DRI 1997 (Magnesium)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Magnesium https://www.efsa.europa.eu", "EFSA DRVs 2015 (Magnesium)", "FEDIAF Pet Food Guidelines 2023"])

    # 20: Manganese (7a63...)
    refined_data.append(["7a63d516-8371-41e5-af2b-9f674eda6db8",
        "Essential trace mineral; cofactor for enzymes in antioxidant defense (SOD), bone development, and metabolism.",
        "Mineral traza esencial; cofactor de enzimas en defensa antioxidante (SOD), desarrollo óseo y metabolismo.",
        "Oligo-élément essentiel ; cofacteur d'enzymes antioxydantes (SOD) et développement osseux.",
        "Важливий мікроелемент; кофактор ферментів антиоксидантного захисту (SOD) та розвитку кісток.",
        "AI: 1.8-2.3 mg/day; supports metabolic health, cartilage formation, and glucose regulation.",
        "AI: 1,8-2,3 mg/día; apoya salud metabólica, formación de cartílago y regulación de glucosa.",
        "AI : 1,8-2,3 mg/jour ; soutient la santé métabolique et la formation du cartilage.",
        "АД: 1,8-2,3 мг/день; підтримує метаболічне здоров'я та формування хрящів.",
        "AAFCO min: 5.0 mg/kg DM (dogs), 7.5 mg/kg (cats); deficiency rare in commercial foods but leads to reproductive/skeletal issues.",
        "AAFCO mín: 5,0 mg/kg MS (perros), 7,5 mg/kg (gatos); deficiencia causa problemas reproductivos/esqueléticos.",
        "AAFCO min : 5,0 mg/kg MS (chiens) ; la carence cause des troubles squelettiques.",
        "AAFCO мін: 5,0 мг/кг СР (собаки), 7,5 мг/кг (коти); дефіцит призводить до репродуктивних проблем.",
        "USDA FoodData Central; NIH ODS Manganese", "National Academies DRI 2001 (Manganese)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Manganese https://www.efsa.europa.eu", "EFSA DRVs 2013 (Manganese)", "FEDIAF Pet Food Guidelines 2023"])

    # 21: Phosphorus (c2e3...)
    refined_data.append(["c2e3860b-d8d0-4159-8ee9-76c70230cd33",
        "Essential mineral; vital for bone/tooth structure, ATP energy transfer, and nucleic acid formation (DNA/RNA).",
        "Mineral esencial; vital para estructura ósea/dental, transferencia de energía ATP y formación de ADN/ARN.",
        "Minéral essentiel ; vital pour la structure osseuse, le transfert d'énergie ATP.",
        "Важливий мінерал; важливий для структури кісток/зубів та передачі енергії АТФ.",
        "RDA: 700 mg/day; ubiquitous in food supply; necessary for cellular function and mineral balance.",
        "RDA: 700 mg/día; ubicuo en suministro alimentos; necesario para función celular.",
        "RDA : 700 mg/jour ; nécessaire pour la fonction cellulaire et l'équilibre minéral.",
        "РНП: 700 мг/день; необхідний для клітинної функції та мінерального балансу.",
        "AAFCO min: 0.5% DM (dogs), 0.5% (cats); closely linked to Calcium; excess can worsen chronic kidney disease (CKD) in elders.",
        "AAFCO mín: 0,5% MS (perros/gatos); ligado al Calcio; exceso puede empeorar enfermedad renal crónica.",
        "AAFCO min : 0,5% MS (chiens/chats) ; étroitement lié au Calcium ; l'excès peut aggraver l'insuffisance rénale.",
        "AAFCO мін: 0,5% СР (собаки/коти); тісно пов'язаний з кальцієм; надлишок може погіршити стан при хворобі нирок.",
        "USDA FoodData Central; NIH ODS Phosphorus", "National Academies DRI 1997 (Phosphorus)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Phosphorus https://www.efsa.europa.eu", "EFSA DRVs 2015 (Phosphorus)", "FEDIAF Pet Food Guidelines 2023"])

    # 22: Potassium (d787...)
    refined_data.append(["d7870698-4319-4bb4-ad3b-fa7359c56985",
        "Essential electrolyte; vital for osmotic balance, nerve impulse transmission, and muscle contraction.",
        "Electrolito esencial; vital para equilibrio osmótico, transmisión nerviosa y contracción muscular.",
        "Électrolyte essentiel ; vital pour l'équilibre osmotique et la transmission nerveuse.",
        "Важливий мінерал-електроліт; важливий для осмотичного балансу та передачі нервових імпульсів.",
        "AI: 2600-3400 mg/day; supports cardiovascular function and blood pressure regulation.",
        "AI: 2600-3400 mg/día; apoya función cardiovascular y regulación de presión arterial.",
        "AI : 2600-3400 mg/jour ; soutient la fonction cardiovasculaire.",
        "АД: 2600-3400 мг/день; підтримує серцево-судинну функцію та тиск.",
        "AAFCO min: 0.6% DM (dogs), 0.6% (cats); essential for heart rhythm and renal function; hypokalemia is a risk in CKD.",
        "AAFCO mín: 0,6% MS (perros/gatos); esencial para ritmo cardíaco y función renal.",
        "AAFCO min : 0,6% MS (chiens/chats) ; essentiel pour le rythme cardiaque et la fonction rénale.",
        "AAFCO мін: 0,6% СР (собаки/коти); важливо для серцевого ритму та функції нирок.",
        "USDA FoodData Central; NIH ODS Potassium", "National Academies DRI 2019 (Potassium)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Potassium https://www.efsa.europa.eu", "EFSA DRVs 2016 (Potassium)", "FEDIAF Pet Food Guidelines 2023"])

    # 23: Selenium (a391...)
    refined_data.append(["a3910e07-224e-4f51-a92e-4c2d26f3c6c0",
        "Essential trace mineral; component of selenoproteins (glutathione peroxidase) vital for antioxidant defense.",
        "Mineral traza esencial; componente de selenoproteínas (glutatión peroxidasa) vital para defensa antioxidante.",
        "Oligo-élément essentiel ; composant des sélénoprotéines (défense antioxydante).",
        "Важливий мікроелемент; компонент селенопротеїнів для антиоксидантного захисту.",
        "RDA: 55 mcg/day; supports immune response, thyroid function, and cellular resilience to oxidative stress.",
        "RDA: 55 mcg/día; apoya respuesta inmune, función tiroidea y resiliencia celular.",
        "RDA : 55 mcg/jour ; soutient l'immunité et la fonction thyroïdienne.",
        "РНП: 55 мкг/день; підтримує імунну відповідь та функцію щитоподібної залози.",
        "AAFCO min: 0.35 mg/kg DM (dogs), 0.3 mg/kg (cats); potent antioxidant; deficiency leads to muscle/heart damage (white muscle disease).",
        "AAFCO mín: 0,35 mg/kg MS (perros), 0,3 mg/kg (gatos); potente antioxidante; deficiencia causa daño muscular/cardíaco.",
        "AAFCO min : 0,35 mg/kg MS (chiens) ; antioxydant puissant ; la carence cause des dommages musculaires.",
        "AAFCO мін: 0,35 мг/кг СР (собаки), 0,3 мг/кг (коти); потужний антиоксидант.",
        "USDA FoodData Central; NIH ODS Selenium", "National Academies DRI 2000 (Selenium)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Selenium https://www.efsa.europa.eu", "EFSA DRVs 2014 (Selenium)", "FEDIAF Pet Food Guidelines 2023"])

    # 24: Sodium (d283...)
    refined_data.append(["d283f015-5d0f-45b0-ba21-7afee5ae4e99",
        "Essential electrolyte; major extracellular cation; vital for osmotic balance and nerve/muscle function.",
        "Electrolito esencial; principal catión extracelular; vital para equilibrio osmótico y función nerviosa/muscular.",
        "Électrolyte essentiel ; principal cation extracellulaire ; vital pour l'équilibre osmotique.",
        "Важливий мінерал-електроліт; основний позаклітинний катіон; важливо для осмотичного балансу.",
        "AI: 1500 mg/day; excess linked to hypertension; crucial for maintaining blood volume and pressure.",
        "IA: 1500 mg/día; exceso ligado a hipertensión; crucial para volumen sanguíneo.",
        "IA : 1500 mg/jour ; l'excès est lié à l'hypertension ; crucial pour la pression sanguine.",
        "АД: 1500 мг/день; надлишок пов'язаний з гіпертензією; критично для кров'яного тиску.",
        "AAFCO min: 0.08-0.3% DM (dogs), 0.2% (cats); essential for hydration/palatability; regulated in heart/kidney failure diets.",
        "AAFCO mín: 0,08-0,3% MS (perros), 0,2% (gatos); esencial para hidratación y palatabilidad.",
        "AAFCO min : 0,08-0,3% MS (chiens) ; essentiel pour l'hydratation et l'appétence.",
        "AAFCO мін: 0,08-0,3% СР (собаки), 0,2% (коти); важливо для гідратації.",
        "USDA FoodData Central; NIH ODS Sodium", "National Academies DRI 2019 (Sodium)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Sodium https://www.efsa.europa.eu", "EFSA DRVs 2019 (Sodium)", "FEDIAF Pet Food Guidelines 2023"])

    # 25: Zinc (8205...)
    refined_data.append(["8205980c-59b2-41ca-b73e-d2b8a53b7aaf",
        "Essential trace mineral; required for >200 enzymes, protein synthesis, wound healing, and immune function.",
        "Mineral traza esencial; requerido para >200 enzimas, síntesis proteica, cicatrización y función inmune.",
        "Oligo-élément essentiel ; requis pour >200 enzymes, la synthèse protéique.",
        "Важливий мікроелемент; необхідний для >200 ферментів, синтезу білка та загоєння ран.",
        "RDA: 8-11 mg/day; supports healthy skin, vision, and immune resilience.",
        "RDA: 8-11 mg/día; apoya piel saludable, visión y resiliencia inmune.",
        "RDA : 8-11 mg/jour ; soutient la peau, la vision et l'immunité.",
        "РНП: 8-11 мг/день; підтримує здоров'я шкіри, зір та імунітет.",
        "AAFCO min: 80 mg/kg DM (dogs), 75 mg/kg (cats); vital for skin integrity and coat quality; deficiency causes parakeratosis.",
        "AAFCO mín: 80 mg/kg MS (perros), 75 mg/kg (gatos); vital para integridad de piel y pelo; deficiencia causa paraqueratosis.",
        "AAFCO min : 80 mg/kg MS (chiens) ; vital pour la peau et le pelage ; la carence cause la parakératose.",
        "AAFCO мін: 80 мг/кг СР (собаки), 75 мг/кг (коти); важливо для цілісності шкіри та якості шерсті.",
        "USDA FoodData Central; NIH ODS Zinc", "National Academies DRI 2001 (Zinc)", "AAFCO 2023 Nutrient Profiles; NRC 2006",
        "EFSA Scientific Opinion Zinc https://www.efsa.europa.eu", "EFSA DRVs 2014 (Zinc)", "FEDIAF Pet Food Guidelines 2023"])

    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerows(refined_data)
    
    print(f"Batch 4 refinement complete. Total {len(refined_data)-1} items refined.")

if __name__ == "__main__":
    refine_batch_4()
