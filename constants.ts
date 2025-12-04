import { Product, Category } from './types';

// --- Image Assets (Unsplash & Professional Placeholders) ---
const IMAGES = {
  Smartphones: [
    "https://images.unsplash.com/photo-1592750432056-f283c6411277?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1610945265078-d86f3d297dfb?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1533228100845-08145b01de14?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1580910051074-3eb6948d3ea0?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=600"  // New
  ],
  Eletrodomésticos: [
    "https://images.unsplash.com/photo-1571175443880-49e1d58b79d8?auto=format&fit=crop&q=80&w=600", // Fridge
    "https://images.unsplash.com/photo-1584269600464-3704b6c73165?auto=format&fit=crop&q=80&w=600", // Appliance
    "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&q=80&w=600", // Kitchen
    "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=600", // Washing
    "https://images.unsplash.com/photo-1583507171266-1c5c2298d75e?auto=format&fit=crop&q=80&w=600", // Microwave
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1536353284924-9220c464e262?auto=format&fit=crop&q=80&w=600"  // New
  ],
  Informática: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600", // Laptop
    "https://images.unsplash.com/photo-1531297461136-82af322ef88a?auto=format&fit=crop&q=80&w=600", // Gaming setup
    "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?auto=format&fit=crop&q=80&w=600", // Dell/Tech
    "https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&q=80&w=600", // Keyboard
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600", // Tech
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600"  // New
  ],
  Móveis: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600", // Sofa
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=600", // Table
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=600", // Sofa 2
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=600", // Living room
    "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600", // Bed/Room
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=600"  // New
  ],
  "TV e Vídeo": [
    "https://images.unsplash.com/photo-1593784991095-a20506948430?auto=format&fit=crop&q=80&w=600", // TV
    "https://images.unsplash.com/photo-1574375927938-d5a98e8efe30?auto=format&fit=crop&q=80&w=600", // TV 2
    "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&q=80&w=600", // TV remote
    "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&q=80&w=600", // TV 3
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=600", // TV 4
    "https://images.unsplash.com/photo-1560169897-fc0cdbcfda77?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1567690187548-f1711322b519?auto=format&fit=crop&q=80&w=600"  // New
  ],
  "Games": [
    "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=600", // PS5 Controller
    "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=600", // Xbox
    "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=600", // Switch like
    "https://images.unsplash.com/photo-1592840496011-a5030a0d9f84?auto=format&fit=crop&q=80&w=600", // Controller
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600", // Gaming generic
    "https://images.unsplash.com/photo-1612287232817-60286063c266?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=600"  // New
  ],
  "Beleza e Perfumaria": [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600", // Perfume
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600", // Makeup
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=600", // Bottles
    "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=600", // Cosmetics
    "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=600", // Cream
    "https://images.unsplash.com/photo-1556228720-198759418dbd?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1571781535014-53bd9429741a?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600"  // New
  ],
  "Esporte e Lazer": [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600", // Gym
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600", // Weights
    "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=600", // Running shoes
    "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600", // Bike
    "https://images.unsplash.com/photo-1576435728678-38d01d52e3a9?auto=format&fit=crop&q=80&w=600", // Yoga
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600"  // New
  ],
  "Moda": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", // T-shirt
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600", // Red Shoe
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600", // Jacket
    "https://images.unsplash.com/photo-1589465885857-44edb59ef526?auto=format&fit=crop&q=80&w=600", // Jeans
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600", // Fashion model
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600"  // New
  ],
  "Automotivo": [
    "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=600", // Tire
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600", // Car interior
    "https://images.unsplash.com/photo-1609526381923-c2889e472256?auto=format&fit=crop&q=80&w=600", // Oil
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600", // Car
    "https://images.unsplash.com/photo-1635784063234-1f6b8014582f?auto=format&fit=crop&q=80&w=600", // Accessories
    "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600", // New
    "https://images.unsplash.com/photo-1552160753-117159d7419d?auto=format&fit=crop&q=80&w=600"  // New
  ]
};

// --- Category Brands Mapping ---
export const CATEGORY_BRANDS: Record<string, string[]> = {
  'Smartphones': ['Samsung', 'Apple', 'Motorola', 'Xiaomi', 'LG', 'Nokia', 'Realme'],
  'Eletrodomésticos': ['Brastemp', 'Electrolux', 'Consul', 'LG', 'Mondial', 'Panasonic'],
  'Informática': ['Dell', 'Apple', 'Samsung', 'Logitech', 'Acer', 'Lenovo', 'Asus'],
  'Móveis': ['Madesa', 'Kappesberg', 'MadeiraMadeira', 'Mobly', 'Tok&Stok'],
  'TV e Vídeo': ['Samsung', 'LG', 'TCL', 'Philips', 'Sony', 'JBL'],
  'Games': ['Sony', 'Microsoft', 'Nintendo', 'Razer', 'Logitech'],
  'Beleza e Perfumaria': ['Lancôme', 'Dior', 'Natura', 'Boticário', 'Taiff', 'Revlon'],
  'Esporte e Lazer': ['Nike', 'Adidas', 'Caloi', 'Polimet', 'Olympikus'],
  'Moda': ['Adidas', 'Nike', 'Zara', 'Renner', 'Hering', 'Levi\'s'],
  'Automotivo': ['Pirelli', 'Michelin', 'Pioneer', 'Multilaser', 'Bosch']
};

// --- Base Products Data ---
// Note: 'specifications' and 'gallery' are populated in the generator
const BASE_PRODUCTS: Omit<Product, 'id' | 'gallery' | 'specifications' | 'stock'>[] = [
  // Smartphones
  {
    title: "Smartphone Samsung Galaxy S24 Ultra 256GB",
    price: 5899.00,
    originalPrice: 8999.00,
    image: IMAGES.Smartphones[0],
    category: "Smartphones",
    brand: "Samsung",
    rating: 4.9,
    reviews: 1250,
    description: "O smartphone definitivo com IA integrada. Câmera de 200MP, processador Snapdragon Gen 3 e estrutura em titânio. Experimente a tradução simultânea, edição generativa de fotos e uma bateria que dura o dia todo.",
    features: [
      "Tela Dynamic AMOLED 2X de 6.8\" QHD+ com Vision Booster e 120Hz",
      "Processador Snapdragon 8 Gen 3 for Galaxy: desempenho extremo",
      "Câmera de 200MP com Nightography para fotos noturnas incríveis",
      "Bateria de 5000mAh com carregamento rápido de 45W",
      "S Pen integrada para produtividade e criatividade",
      "Galaxy AI: Inteligência Artificial para tradução e edição"
    ]
  },
  {
    title: "iPhone 15 Pro Max Titânio Natural 256GB",
    price: 7299.00,
    originalPrice: 9599.00,
    image: IMAGES.Smartphones[1],
    category: "Smartphones",
    brand: "Apple",
    rating: 4.8,
    reviews: 980,
    description: "Design em titânio aeroespacial, chip A17 Pro e botão de Ação personalizável. O iPhone mais poderoso já feito. Capture vídeos espaciais e desfrute de gráficos com Ray Tracing acelerado por hardware.",
    features: [
      "Estrutura em Titânio Aeroespacial leve e resistente",
      "Chip A17 Pro: a maior mudança na história das GPUs da Apple",
      "Sistema de câmera Pro com lente teleobjetiva de 5x",
      "Botão de Ação personalizável para atalhos rápidos",
      "Tela Super Retina XDR com tecnologia ProMotion 120Hz",
      "Conector USB-C com velocidades USB 3 para transferências rápidas"
    ]
  },
  {
    title: "Smartphone Motorola Edge 40 Neo 256GB",
    price: 2199.00,
    originalPrice: 2899.00,
    image: IMAGES.Smartphones[2],
    category: "Smartphones",
    brand: "Motorola",
    rating: 4.6,
    reviews: 450,
    description: "Design ultrafino com proteção IP68 contra água. Cores Pantone vibrantes e desempenho fluido com 5G. Carregamento TurboPower que te dá energia para o dia todo em minutos.",
    features: [
      "Tela pOLED de 6.55\" com taxa de atualização de 144Hz",
      "Proteção IP68: resistente à poeira e imersão em água",
      "Câmera Ultra Pixel de 50MP com estabilização OIS",
      "Carregamento TurboPower de 68W: 50% em 15 minutos",
      "Design ultrafino e acabamento em cores Pantone",
      "Conectividade 5G para navegação ultrarrápida"
    ]
  },
  {
    title: "Xiaomi Redmi Note 13 Pro+ 5G",
    price: 2699.00,
    originalPrice: 3299.00,
    image: IMAGES.Smartphones[3],
    category: "Smartphones",
    brand: "Xiaomi",
    rating: 4.7,
    reviews: 890,
    description: "Câmera de 200MP com OIS, carregamento HyperCharge de 120W e design curvo premium. Uma experiência de flagship por um preço acessível, com proteção contra água e poeira.",
    features: [
      "Câmera principal de 200MP com OIS para detalhes insuperáveis",
      "Carregamento HyperCharge de 120W (100% em 19 minutos)",
      "Tela AMOLED CrystalRes de 1.5K e 120Hz curva",
      "Certificação IP68 de resistência à água e poeira",
      "Processador MediaTek Dimensity 7200-Ultra de alta eficiência",
      "Bateria de 5000mAh de longa duração"
    ]
  },
  // Eletrodomésticos
  {
    title: "Geladeira Brastemp Frost Free Inox 375L",
    price: 3100.00,
    originalPrice: 3899.00,
    image: IMAGES.Eletrodomésticos[0],
    category: "Eletrodomésticos",
    brand: "Brastemp",
    rating: 4.8,
    reviews: 560,
    description: "Espaço e organização para sua cozinha. Tecnologia Frost Free e compartimentos especiais para latas e long necks. Mantenha seus alimentos frescos por muito mais tempo com o sistema de circulação de ar avançado.",
    features: [
      "Tecnologia Frost Free: não precisa descongelar nunca",
      "Compartimento Latas e Long Necks de acesso rápido",
      "Espaço Adapt: prateleiras ajustáveis para itens de diversos tamanhos",
      "Turbo Ice: gelo mais rápido sempre que precisar",
      "Acabamento em Inox com proteção contra corrosão e ferrugem",
      "Painel Eletrônico externo para controle de temperatura"
    ]
  },
  {
    title: "Fritadeira Elétrica Air Fryer Mondial 4L",
    price: 349.90,
    originalPrice: 599.90,
    image: IMAGES.Eletrodomésticos[1],
    category: "Eletrodomésticos",
    brand: "Mondial",
    rating: 4.9,
    reviews: 5120,
    description: "Alimentação mais saudável sem óleo. Cesto quadrado com capacidade de 4L para toda a família. Prepare batatas crocantes, carnes suculentas e até bolos com praticidade e rapidez.",
    features: [
      "Capacidade de 4 Litros: ideal para receitas de família",
      "Cesto quadrado removível e antiaderente Duraflon",
      "Controle de temperatura até 200°C para diversos preparos",
      "Timer de 60 minutos com aviso sonoro e desligamento automático",
      "Potência de 1500W para cozimento rápido e uniforme",
      "Lâmpadas piloto que indicam funcionamento e aquecimento"
    ]
  },
  {
    title: "Máquina de Lavar Electrolux 13kg Essential Care",
    price: 1899.00,
    originalPrice: 2399.00,
    image: IMAGES.Eletrodomésticos[2],
    category: "Eletrodomésticos",
    brand: "Electrolux",
    rating: 4.7,
    reviews: 320,
    description: "Lava mais roupas em menos tempo com o sistema Jet&Clean que dilui o sabão e o amaciante. Filtro pega fiapos com volume de filtragem 40% maior.",
    features: [
      "Sistema Jet&Clean: dilui 100% do sabão e amaciante",
      "Filtro Pega Fiapos com volume de filtragem 40% maior",
      "Dispenser Autolimpante com tecnologia Jet&Clean",
      "Programa Rápido de 15 minutos para roupas pouco sujas",
      "Tecla Reutilização de Água para economia doméstica",
      "Diluição inteligente que evita manchas nas roupas"
    ]
  },
  {
    title: "Micro-ondas LG 30L EasyClean",
    price: 799.00,
    originalPrice: 1099.00,
    image: IMAGES.Eletrodomésticos[3],
    category: "Eletrodomésticos",
    brand: "LG",
    rating: 4.6,
    reviews: 210,
    description: "Revestimento EasyClean que evita a penetração de gordura, facilitando a limpeza. Cozimento uniforme e descongelamento preciso com a tecnologia I-Wave.",
    features: [
      "Revestimento EasyClean antibacteriano: limpeza 2x mais fácil",
      "Tecnologia I-Wave para cozimento e descongelamento uniformes",
      "Função Eco On: economiza até 52% de energia em stand-by",
      "16 Receitas Pré-programadas no Menu Brasileiro",
      "Design espelhado moderno que combina com qualquer cozinha",
      "Trava de segurança para crianças"
    ]
  },
  // Informática
  {
    title: "Notebook Dell Inspiron 15 Intel Core i5 8GB",
    price: 2899.00,
    originalPrice: 3599.00,
    image: IMAGES.Informática[0],
    category: "Informática",
    brand: "Dell",
    rating: 4.6,
    reviews: 890,
    description: "Produtividade e desempenho. Ideal para estudos e trabalho, com tela Full HD e armazenamento SSD rápido. Design leve e compacto para levar onde quiser.",
    features: [
      "Processador Intel Core i5 de 12ª Geração para multitarefas",
      "Armazenamento SSD NVMe de 256GB: inicialização em segundos",
      "Tela Full HD WVA de 15.6\" com bordas finas e antirreflexo",
      "ComfortView: reduz a emissão de luz azul prejudicial",
      "Teclado numérico integrado para maior produtividade",
      "Dobradiça elevação para melhor ergonomia e refrigeração"
    ]
  },
  {
    title: "MacBook Air M1 13\" 256GB Cinza Espacial",
    price: 6499.00,
    originalPrice: 8999.00,
    image: IMAGES.Informática[1],
    category: "Informática",
    brand: "Apple",
    rating: 5.0,
    reviews: 1500,
    description: "O notebook mais fino e leve da Apple, supercarregado pelo chip M1. Bateria que dura o dia todo, design silencioso sem ventoinha e desempenho revolucionário.",
    features: [
      "Chip Apple M1: desempenho de CPU, GPU e aprendizado automático",
      "Bateria com até 18 horas de duração para o dia todo",
      "Design sem ventoinha para operação totalmente silenciosa",
      "Tela Retina de 13,3\" com ampla tonalidade de cores P3",
      "Magic Keyboard retroiluminado e Touch ID",
      "Wi-Fi 6 para conectividade ultrarrápida"
    ]
  },
  {
    title: "Monitor Gamer Samsung Odyssey 24\" 144Hz",
    price: 1199.00,
    originalPrice: 1699.00,
    image: IMAGES.Informática[2],
    category: "Informática",
    brand: "Samsung",
    rating: 4.8,
    reviews: 670,
    description: "Imersão total nos seus jogos com taxa de atualização de 144Hz e tempo de resposta de 1ms. Tecnologia AMD FreeSync para jogabilidade fluida sem quebra de imagem.",
    features: [
      "Taxa de atualização de 144Hz para jogabilidade ultra-fluida",
      "Tempo de resposta de 1ms (MPRT) elimina o desfoque de movimento",
      "AMD FreeSync Premium para evitar rasgos na tela",
      "Suporte totalmente ajustável: altura, inclinação e rotação",
      "Design sem bordas em 3 lados para imersão máxima",
      "Modo Eye Saver e Flicker Free para conforto visual"
    ]
  },
  {
    title: "Teclado Mecânico Logitech G Pro X",
    price: 799.00,
    originalPrice: 999.00,
    image: IMAGES.Informática[3],
    category: "Informática",
    brand: "Logitech",
    rating: 4.7,
    reviews: 430,
    description: "Desenvolvido com profissionais de esports. Switches GX Blue Clicky trocáveis para personalização total. Design compacto sem teclado numérico para mais espaço na mesa.",
    features: [
      "Switches mecânicos GX Blue Clicky de nível profissional",
      "Design Tenkeyless (TKL) compacto e portátil",
      "Iluminação RGB LIGHTSYNC personalizável com memória integrada",
      "Cabo micro USB removível para transporte seguro",
      "Pés de borracha com 3 ângulos de ajuste",
      "Switches trocáveis (User Swap) para personalização avançada"
    ]
  },
  // Móveis
  {
    title: "Sofá Retrátil e Reclinável 3 Lugares Suede",
    price: 1499.00,
    originalPrice: 2299.00,
    image: IMAGES.Móveis[0],
    category: "Móveis",
    brand: "Mobly",
    rating: 4.5,
    reviews: 420,
    description: "Conforto máximo para sua sala. Assentos com espuma D28 e encosto com fibra siliconada. Estrutura robusta em madeira de reflorestamento tratada.",
    features: [
      "Assento retrátil com espuma D28 de alta densidade",
      "Encosto reclinável com 4 estágios e fibra 100% siliconada",
      "Estrutura em madeira de eucalipto reflorestada e tratada",
      "Revestimento em tecido Suede Veludo de toque macio",
      "Rodízios de silicone que não riscam o piso",
      "Largura total de 2.10m, ideal para 3 pessoas confortavelmente"
    ]
  },
  {
    title: "Guarda-Roupa Casal 6 Portas com Espelho",
    price: 999.00,
    originalPrice: 1499.00,
    image: IMAGES.Móveis[1],
    category: "Móveis",
    brand: "Madesa",
    rating: 4.3,
    reviews: 180,
    description: "Amplo espaço interno com prateleiras bem distribuídas e cabideiros em alumínio. Acabamento em pintura poliéster de alta resistência.",
    features: [
      "6 portas de bater com dobradiças metálicas de pressão",
      "2 gavetas internas com corrediças metálicas suaves",
      "Cabideiros em alumínio resistentes para roupas longas",
      "Acabamento em Pintura Poliéster de 7 camadas (alta proteção)",
      "Puxadores em PVC com design ergonômico",
      "Espelhos externos que ampliam o ambiente"
    ]
  },
  {
    title: "Mesa de Jantar 4 Cadeiras Tampo de Vidro",
    price: 899.00,
    originalPrice: 1299.00,
    image: IMAGES.Móveis[2],
    category: "Móveis",
    brand: "Kappesberg",
    rating: 4.6,
    reviews: 250,
    description: "Design moderno que combina com qualquer decoração. Cadeiras estofadas confortáveis com tecido de fácil limpeza e tampo de vidro temperado seguro.",
    features: [
      "Base da mesa em formato pedestal moderno e firme",
      "Tampo de vidro temperado de 8mm, mais seguro e elegante",
      "Cadeiras com estrutura 100% MDF e encosto ergonômico",
      "Assentos estofados com espumas de alta densidade",
      "Revestimento em tecido Suede ou Linho fácil de limpar",
      "Sapatas plásticas para proteção do piso"
    ]
  },
  {
    title: "Cadeira Gamer ThunderX3 Profissional",
    price: 1099.00,
    originalPrice: 1599.00,
    image: IMAGES.Móveis[3],
    category: "Móveis",
    brand: "ThunderX3",
    rating: 4.7,
    reviews: 890,
    description: "Ergonomia para longas horas de jogo ou trabalho. Apoio de braço ajustável em 2 direções e encosto reclinável até 180 graus.",
    features: [
      "Tecnologia AIR Tech para maior respirabilidade",
      "Revestimento em Couro Sintético Premium com detalhes em carbono",
      "Espuma de alta densidade para conforto prolongado",
      "Apoios de braço bidirecionais (2D) ajustáveis",
      "Encosto reclinável de 90° a 180° (modo descanso)",
      "Inclui almofadas para a lombar e pescoço"
    ]
  },
  // TV e Vídeo
  {
    title: "Smart TV 55\" 4K LED LG UHD ThinQ AI",
    price: 2399.00,
    originalPrice: 3199.00,
    image: IMAGES["TV e Vídeo"][0],
    category: "TV e Vídeo",
    brand: "LG",
    rating: 4.7,
    reviews: 3400,
    description: "Experiência de cinema em casa com cores vivas e detalhes incríveis. Controle por voz e inteligência artificial ThinQ AI para controlar sua casa conectada.",
    features: [
      "Resolução 4K UHD Real para imagens nítidas",
      "Processador AI a5 Gen6 4K para aprimoramento de imagem",
      "Interface Smart webOS 23: fluida e personalizada",
      "Controle Smart Magic com comando de voz e cursor (mouse)",
      "Otimizador de Games e Painel de Jogos integrados",
      "Alerta de Esportes para acompanhar seu time favorito"
    ]
  },
  {
    title: "Smart TV 65\" Samsung Neo QLED 4K",
    price: 5499.00,
    originalPrice: 7999.00,
    image: IMAGES["TV e Vídeo"][1],
    category: "TV e Vídeo",
    brand: "Samsung",
    rating: 4.9,
    reviews: 210,
    description: "Pretos profundos e brilho intenso com a tecnologia Mini LED. Design NeoSlim ultra fino e som em movimento que acompanha a ação na tela.",
    features: [
      "Tecnologia Quantum Matrix (Mini LED): contraste perfeito",
      "Processador Neural Quantum 4K com IA para upscaling",
      "Taxa de atualização de 120Hz e Motion Xcelerator Turbo+",
      "Som em Movimento Virtual e Dolby Atmos sem fios",
      "Gaming Hub: jogue Xbox Cloud Gaming sem console",
      "Design NeoSlim: menos de 2.7cm de espessura"
    ]
  },
  {
    title: "Soundbar JBL Cinema SB190 2.1 Canais",
    price: 1599.00,
    originalPrice: 2199.00,
    image: IMAGES["TV e Vídeo"][3],
    category: "TV e Vídeo",
    brand: "JBL",
    rating: 4.8,
    reviews: 320,
    description: "Graves profundos e som imersivo com Virtual Dolby Atmos. Subwoofer sem fio para graves impactantes sem a bagunça de cabos.",
    features: [
      "Potência total de 380W para som de cinema",
      "Virtual Dolby Atmos para experiência de áudio imersiva",
      "Subwoofer sem fio de 6.5\" para graves profundos",
      "Conexão HDMI eARC para áudio de alta qualidade da TV",
      "Streaming de música via Bluetooth sem fio",
      "Modo de voz dedicado para clareza nos diálogos"
    ]
  },
  // Games
  {
    title: "Console PlayStation 5 Slim com 1TB SSD",
    price: 3699.00,
    originalPrice: 4499.00,
    image: IMAGES.Games[0],
    category: "Games",
    brand: "Sony",
    rating: 4.9,
    reviews: 3420,
    description: "Jogue como nunca antes. Carregamento rápido com SSD ultrarrápido, imersão mais profunda com feedback tátil, gatilhos adaptáveis e áudio 3D.",
    features: [
      "Design Slim: mais compacto com o mesmo poder",
      "SSD ultrarrápido de 1TB: carregamento quase instantâneo",
      "Ray Tracing para gráficos realistas e iluminação natural",
      "Suporte a jogos em 4K e até 120fps",
      "Tecnologia Tempest 3D AudioTech para som espacial",
      "Controle DualSense com feedback tátil e gatilhos adaptáveis"
    ]
  },
  {
    title: "Console Xbox Series X 1TB Preto",
    price: 4299.00,
    originalPrice: 4999.00,
    image: IMAGES.Games[1],
    category: "Games",
    brand: "Microsoft",
    rating: 4.9,
    reviews: 1560,
    description: "O Xbox mais rápido e poderoso de todos os tempos. 12 teraflops de potência de processamento. Milhares de jogos de quatro gerações de Xbox.",
    features: [
      "12 Teraflops de potência gráfica bruta",
      "Arquitetura Xbox Velocity para velocidade e desempenho",
      "Quick Resume: alterne entre jogos instantaneamente",
      "Jogos em 4K real a até 120 quadros por segundo",
      "Retrocompatibilidade com milhares de jogos",
      "Suporte a Dolby Vision e Dolby Atmos em jogos"
    ]
  },
  {
    title: "Console Nintendo Switch OLED",
    price: 2199.00,
    originalPrice: 2699.00,
    image: IMAGES.Games[2],
    category: "Games",
    brand: "Nintendo",
    rating: 4.8,
    reviews: 2800,
    description: "Tela OLED de 7 polegadas com cores vibrantes e contraste nítido. Modo TV, semiportátil e portátil para jogar onde e quando quiser.",
    features: [
      "Tela OLED de 7 polegadas com cores vivas e preto real",
      "Dock com porta LAN integrada para internet estável na TV",
      "64GB de armazenamento interno expansível",
      "Suporte ajustável amplo para modo semiportátil",
      "Áudio aprimorado nos alto-falantes integrados",
      "Versatilidade 3 em 1: Modo TV, Semiportátil e Portátil"
    ]
  },
  {
    title: "Controle DualSense Sem Fio - Midnight Black",
    price: 399.00,
    originalPrice: 499.00,
    image: IMAGES.Games[3],
    category: "Games",
    brand: "Sony",
    rating: 4.9,
    reviews: 890,
    description: "Descubra uma experiência de jogo mais profunda e imersiva com o novo controlador inovador do PS5, apresentando feedback tátil e efeitos de gatilho dinâmicos.",
    features: [
      "Feedback tátil imersivo que substitui a vibração tradicional",
      "Gatilhos adaptáveis com níveis de resistência dinâmicos",
      "Microfone embutido e entrada para headset",
      "Botão Criar para capturar e transmitir momentos épicos",
      "Design evoluído em dois tons com barra de luz aprimorada",
      "Bateria recarregável via USB Type-C"
    ]
  },
  // Beleza e Perfumaria
  {
    title: "Perfume La Vie Est Belle Lancôme 100ml",
    price: 549.90,
    originalPrice: 729.90,
    image: IMAGES["Beleza e Perfumaria"][0],
    category: "Beleza e Perfumaria",
    brand: "Lancôme",
    rating: 4.9,
    reviews: 1200,
    description: "Fragrância icônica, floral e gourmand. A escolha da felicidade. Com notas de Iris Pallida, Patchouli e Baunilha.",
    features: [
      "Eau de Parfum de longa duração e projeção marcante",
      "Família Olfativa: Floral Oriental Gourmand",
      "Notas de Topo: Pêra e Cassis",
      "Notas de Coração: Íris, Jasmim e Flor de Laranjeira",
      "Notas de Fundo: Patchouli, Fava Tonka, Baunilha e Pralinê",
      "Frasco icônico 'O Sorriso de Cristal' recarregável"
    ]
  },
  {
    title: "Kit Maquiagem Completa Profissional",
    price: 299.90,
    originalPrice: 450.00,
    image: IMAGES["Beleza e Perfumaria"][1],
    category: "Beleza e Perfumaria",
    brand: "Revlon",
    rating: 4.6,
    reviews: 560,
    description: "Tudo o que você precisa para uma make perfeita. Sombras super pigmentadas, batons de longa duração, pinceis macios e estojo exclusivo.",
    features: [
      "Paleta de sombras com 24 cores de alta pigmentação",
      "5 Pincéis profissionais de cerdas sintéticas macias",
      "Base líquida de cobertura média e acabamento natural",
      "Batons com fórmula hidratante de longa duração",
      "Produtos Cruelty Free (não testados em animais)",
      "Acompanha maleta organizadora resistente"
    ]
  },
  {
    title: "Secador de Cabelo Taiff Tourmaline 2000W",
    price: 259.90,
    originalPrice: 359.90,
    image: IMAGES["Beleza e Perfumaria"][2],
    category: "Beleza e Perfumaria",
    brand: "Taiff",
    rating: 4.8,
    reviews: 3200,
    description: "Potência e tecnologia para cabelos mais brilhantes e sem frizz. A turmalina potencializa a ação dos íons negativos, selando as cutículas.",
    features: [
      "Potência de 2000W para secagem super rápida",
      "Tecnologia Turmalina: potencializa os íons negativos",
      "Emissão de Íons Negativos: sela cutículas e reduz frizz",
      "Motor AC Profissional: maior durabilidade e desempenho",
      "Grade traseira removível para facilitar limpeza",
      "Cabo de 3 metros para liberdade de movimento"
    ]
  },
  // Esporte e Lazer
  {
    title: "Bicicleta Aro 29 MTB Alumínio 21 Marchas",
    price: 1299.00,
    originalPrice: 1899.00,
    image: IMAGES["Esporte e Lazer"][3],
    category: "Esporte e Lazer",
    brand: "Caloi",
    rating: 4.5,
    reviews: 430,
    description: "Ideal para trilhas leves e passeios urbanos. Quadro em alumínio leve e resistente, com freios a disco para maior segurança em dias de chuva.",
    features: [
      "Quadro em Alumínio 6061 tratado: leve e resistente",
      "Suspensão dianteira para absorção de impactos",
      "Câmbio de 21 velocidades para encarar subidas",
      "Freios a Disco Mecânico: frenagem segura em qualquer clima",
      "Aro 29 de parede dupla: maior estabilidade e rendimento",
      "Trocadores Rapid Fire para mudanças de marcha precisas"
    ]
  },
  {
    title: "Kit Halteres + Barra + Anilhas 20kg",
    price: 349.90,
    originalPrice: 499.90,
    image: IMAGES["Esporte e Lazer"][1],
    category: "Esporte e Lazer",
    brand: "Polimet",
    rating: 4.7,
    reviews: 210,
    description: "Monte sua academia em casa. Kit completo e ajustável para diversos exercícios de musculação. Anilhas revestidas que não danificam o piso.",
    features: [
      "Total de 20kg em anilhas distribuídas",
      "Anilhas revestidas em PVC: protegem o piso e não oxidam",
      "2 Barras ocas de 40cm com pegada texturizada",
      "4 Presilhas de segurança tipo grampo",
      "Permite montagem de halteres com pesos variados",
      "Ideal para treinos de bíceps, tríceps, ombros e peito"
    ]
  },
  {
    title: "Tênis de Corrida Nike Revolution 6",
    price: 299.90,
    originalPrice: 399.90,
    image: IMAGES["Esporte e Lazer"][2],
    category: "Esporte e Lazer",
    brand: "Nike",
    rating: 4.6,
    reviews: 1500,
    description: "Conforto e amortecimento para sua corrida ou caminhada. Design respirável feito com pelo menos 20% de conteúdo reciclado.",
    features: [
      "Entressola em espuma macia para amortecimento responsivo",
      "Cabedal em mesh leve e respirável",
      "Solado de borracha gerado por computador para tração",
      "Reforço no calcanhar para suporte e estabilidade",
      "Design sustentável: 20% de material reciclado",
      "Flexibilidade natural para uma passada suave"
    ]
  },
  // Moda
  {
    title: "Camiseta Básica Algodão Kit 5 Peças",
    price: 149.90,
    originalPrice: 199.90,
    image: IMAGES.Moda[0],
    category: "Moda",
    brand: "Hering",
    rating: 4.4,
    reviews: 890,
    description: "Essenciais para o dia a dia. Conforto e durabilidade em algodão 100%. Modelagem regular que se adapta bem ao corpo.",
    features: [
      "Kit com 5 cores básicas e versáteis",
      "Tecido 100% Algodão de alta qualidade e toque macio",
      "Modelagem Regular Fit: conforto sem sobrar tecido",
      "Costuras reforçadas na gola e ombros",
      "Não encolhe e não desbota facilmente após lavagem",
      "Ideal para uso casual ou composição de looks"
    ]
  },
  {
    title: "Tênis Casual Adidas Grand Court",
    price: 349.90,
    originalPrice: 449.90,
    image: IMAGES.Moda[1],
    category: "Moda",
    brand: "Adidas",
    rating: 4.8,
    reviews: 670,
    description: "Estilo clássico das quadras para as ruas. Conforto Cloudfoam na palmilha para um caminhar macio durante todo o dia.",
    features: [
      "Design inspirado nas quadras de tênis dos anos 70",
      "Cabedal em couro sintético durável e fácil de limpar",
      "Palmilha Cloudfoam Comfort para amortecimento superior",
      "Solado de borracha resistente e aderente",
      "As três listras icônicas da Adidas nas laterais",
      "Forro têxtil confortável que evita atrito"
    ]
  },
  {
    title: "Jaqueta Jeans Unissex Azul Clássica",
    price: 199.90,
    originalPrice: 289.90,
    image: IMAGES.Moda[2],
    category: "Moda",
    brand: "Levi's",
    rating: 4.7,
    reviews: 320,
    description: "Peça versátil que nunca sai de moda. Lavagem clássica e bolsos frontais. Combina com tudo, do casual ao despojado.",
    features: [
      "Jeans 100% Algodão robusto e durável",
      "Corte reto clássico (Trucker Jacket)",
      "Botões metálicos personalizados de alta resistência",
      "Dois bolsos no peito com aba e bolsos laterais",
      "Ajustes laterais na bainha para caimento perfeito",
      "Lavagem média versátil que combina com tudo"
    ]
  },
  // Automotivo
  {
    title: "Kit 4 Pneus Pirelli Aro 15 195/60",
    price: 1899.00,
    originalPrice: 2499.00,
    image: IMAGES.Automotivo[0],
    category: "Automotivo",
    brand: "Pirelli",
    rating: 4.8,
    reviews: 450,
    description: "Segurança e desempenho para seu veículo. Alta durabilidade e aderência em pistas secas e molhadas. Tecnologia que reduz o ruído.",
    features: [
      "Modelo Pirelli Cinturato P1: referência em performance",
      "Medida 195/60 R15: compatível com diversos sedans e hatches",
      "Sulcos profundos para excelente drenagem de água",
      "Baixa resistência ao rolamento: economia de combustível",
      "Composto híbrido para maior durabilidade da banda",
      "Redução de ruído para uma viagem mais silenciosa"
    ]
  },
  {
    title: "Central Multimídia Android 9 Polegadas",
    price: 699.00,
    originalPrice: 999.00,
    image: IMAGES.Automotivo[1],
    category: "Automotivo",
    brand: "Pioneer",
    rating: 4.5,
    reviews: 230,
    description: "Conectividade total no seu carro. GPS, Bluetooth, Espelhamento de tela e muito mais em uma tela grande e responsiva.",
    features: [
      "Tela Touch Screen Capacitiva de 9 polegadas HD",
      "Sistema Android integrado: baixe apps como Waze e Spotify",
      "Conectividade Bluetooth 5.0 para chamadas e música",
      "Espelhamento de tela para Android e iOS (sem fio)",
      "Entrada para câmera de ré e comandos de volante",
      "GPS Offline integrado e antena Wi-Fi"
    ]
  },
  {
    title: "Aspirador de Pó Automotivo Portátil",
    price: 89.90,
    originalPrice: 149.90,
    image: IMAGES.Automotivo[4],
    category: "Automotivo",
    brand: "Multilaser",
    rating: 4.3,
    reviews: 120,
    description: "Mantenha seu carro sempre limpo. Compacto, potente e fácil de usar. Liga direto no acendedor de cigarros.",
    features: [
      "Conector 12V para ligar no acendedor do carro",
      "Potência de 60W para sugar pó, migalhas e areia",
      "Filtro removível e lavável: economia e praticidade",
      "Acompanha bico extensor para cantos e frestas",
      "Cabo longo de 3 metros para alcançar todo o carro",
      "Leve e compacto: cabe no porta-luvas ou porta-malas"
    ]
  }
];

const getMockSpecs = (category: string): Record<string, string> => {
  switch(category) {
    case 'Smartphones':
      return { "Memória RAM": "8GB/12GB", "Processador": "Octa-Core", "Bateria": "5000 mAh", "Conectividade": "5G, Wi-Fi 6E, Bluetooth 5.3", "Sistema Operacional": "Android / iOS" };
    case 'Eletrodomésticos':
      return { "Voltagem": "110V / 220V", "Consumo": "Nível A (Procel)", "Garantia": "12 Meses", "Material": "Inox / Plástico", "Peso": "35kg" };
    case 'Informática':
      return { "Processador": "Intel / M1", "Armazenamento": "SSD NVMe", "Tela": "IPS Antirreflexo", "Portas": "USB-C, HDMI, P2", "Peso": "1.5kg" };
    case 'TV e Vídeo':
      return { "Resolução": "4K UHD", "HDR": "HDR10+", "Taxa de Atualização": "60Hz / 120Hz", "Smart": "Sim", "Entradas": "3x HDMI, 2x USB" };
    case 'Móveis':
      return { "Material": "MDF / MDP", "Acabamento": "Pintura UV", "Montagem": "Necessita Montagem", "Garantia": "3 Meses", "Peso Suportado": "120kg" };
    default:
      return { "Marca": "Original", "Garantia": "3 Meses", "Origem": "Nacional", "Modelo": "2024", "Cor": "Variada" };
  }
};

const getExtendedDescription = (category: string, description: string): string => {
  const benefits = `\n\n**Principais Benefícios:**\nEste produto foi projetado para oferecer durabilidade e eficiência no seu dia a dia. Fabricado com materiais de alta qualidade, ele garante resistência e performance superior, sendo a escolha ideal para quem não abre mão de tecnologia e conforto.`;
  
  let guide = "";
  
  switch(category) {
    case 'Smartphones':
      guide = `\n\n**Dica da Maga:**\nPara prolongar a vida útil da bateria, evite deixar o aparelho descarregar completamente com frequência. Use o modo de economia de energia quando necessário e mantenha o sistema sempre atualizado para garantir segurança e novos recursos.`;
      break;
    case 'Eletrodomésticos':
      guide = `\n\n**Guia de Uso Rápido:**\nAntes do primeiro uso, leia atentamente o manual. Certifique-se de que a voltagem da tomada é compatível com o produto. Para limpeza, utilize apenas pano úmido e sabão neutro, evitando produtos abrasivos que possam danificar o acabamento.`;
      break;
    case 'Informática':
      guide = `\n\n**Maximizando a Performance:**\nMantenha as saídas de ar desobstruídas para evitar superaquecimento. Realize backups periódicos dos seus arquivos importantes e utilize um bom antivírus para navegar com segurança.`;
      break;
    case 'Moda':
      guide = `\n\n**Cuidados com a Peça:**\nSiga sempre as instruções de lavagem na etiqueta. Evite secar ao sol forte para preservar a cor original. Para passar, ajuste a temperatura do ferro de acordo com o tipo de tecido.`;
      break;
    case 'Beleza e Perfumaria':
      guide = `\n\n**Modo de Aplicação:**\nPara melhor fixação, aplique sobre a pele limpa e hidratada. Evite friccionar o local após a aplicação para não alterar a fragrância. Mantenha o produto longe de luz direta e calor excessivo.`;
      break;
    default:
      guide = `\n\n**Dicas de Conservação:**\nArmazene o produto em local seco e arejado. Siga as recomendações do fabricante para manutenção preventiva e garantia de funcionamento perfeito por muito mais tempo.`;
  }

  return description + benefits + guide;
};

// --- Product Generator ---
const generateProducts = (baseProducts: Omit<Product, 'id' | 'gallery' | 'specifications' | 'stock'>[], totalCount: number): Product[] => {
  const products: Product[] = [];
  
  for (let i = 0; i < totalCount; i++) {
    const templateIndex = i % baseProducts.length;
    const template = baseProducts[templateIndex];
    
    // Add variations to make products unique
    const variance = (Math.random() * 0.4) - 0.2; // +/- 20% price variation
    const newPrice = Math.round(template.price * (1 + variance));
    const newOriginalPrice = template.originalPrice ? Math.round(template.originalPrice * (1 + variance)) : undefined;
    
    // Slight title variation for uniqueness beyond the first set
    let titleSuffix = "";
    if (i >= baseProducts.length) {
      const colors = ["Preto", "Branco", "Prata", "Azul", "Grafite", "Dourado", "Vermelho", "Rosa", "Verde"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const editions = ["Edição Especial", "Pro", "Plus", "2024", "Premium", "Limited"];
      const edition = editions[Math.floor(Math.random() * editions.length)];

      titleSuffix = ` - ${color}`;
      if (Math.random() > 0.6) titleSuffix += ` (${edition})`;
    }

    // Get specific images for this category to rotate
    const catImages = IMAGES[template.category as keyof typeof IMAGES] || [];
    const mainImage = catImages.length > 0 ? catImages[i % catImages.length] : template.image;

    // Generate Gallery (Main Image + 3-4 random images from same category)
    const gallery = [mainImage];
    const otherImages = catImages.filter(img => img !== mainImage);
    // Shuffle and pick 4
    const shuffled = otherImages.sort(() => 0.5 - Math.random());
    gallery.push(...shuffled.slice(0, 4)); 

    // Generate Random Stock (weighted to be available)
    // 5% chance of being out of stock (0), otherwise 1 to 20
    const stock = Math.random() < 0.05 ? 0 : Math.floor(Math.random() * 20) + 1;

    products.push({
      ...template,
      id: i + 1,
      title: `${template.title}${titleSuffix}`,
      price: newPrice,
      originalPrice: newOriginalPrice,
      image: mainImage,
      gallery: gallery,
      stock: stock,
      // Ensure features are copied; in a real app we might vary these too
      features: [...template.features],
      specifications: getMockSpecs(template.category),
      description: getExtendedDescription(template.category, template.description),
      reviews: Math.floor(Math.random() * 5000) + 10,
      rating: 3.5 + (Math.random() * 1.5) // Random rating between 3.5 and 5.0
    });
  }

  return products;
};

// Generate 1200 products (increased from 1000)
export const MOCK_PRODUCTS: Product[] = generateProducts(BASE_PRODUCTS, 1200);

export const CATEGORIES: Category[] = [
  'Todos',
  'Smartphones',
  'Eletrodomésticos',
  'Informática',
  'Móveis',
  'TV e Vídeo',
  'Games',
  'Beleza e Perfumaria',
  'Esporte e Lazer',
  'Moda',
  'Automotivo'
];