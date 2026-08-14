

<!-- Start of picture text -->
sf @Q \é<br>ZV OS) Ne 5<br>e WYa,<br>ERDAD os HARRY »<br>G” ae SS e<br>CATEMDY<br><!-- End of picture text -->



<!-- Start of picture text -->
sf @Q \é<br>ZV OS) Ne 5<br>e WYa,<br>ERDAD os HARRY »<br>G” ae SS e<br>CATEMDY<br><!-- End of picture text -->

# **INDICE** 

|INTRODUCCIÓN ........................................................................................................... 6|
|---|
|CAPÍTULO I ................................................................................................................. 10|
|MARCO CONCEPTUAL ................................................................................................ 10|
|1.1.1 Portainer ......................................................................................................... 11|
|1.1.2 Rancher .......................................................................................................... 11|
|1.1.3 Kubernetes Dashboard .................................................................................... 12|
|1.1.4 Cockpit y Swarmpit ......................................................................................... 12|
|1.1.5 ManageIQ ....................................................................................................... 13|
|1.1.6 Conclusiones de los antecedentes ................................................................... 13|
|1.2 Cuadro Comparativo .......................................................................................... 15|
|1.3 Mapa Mental ...................................................................................................... 17|
|1.4 Justifcación ...................................................................................................... 18|
|1.5 Descripción del problema ................................................................................... 20|
|1.5.1 Causas del problema ...................................................................................... 20|
|1.5.2 Problema ........................................................................................................ 21|
|1.5.3 Consecuencias ............................................................................................... 21|
|1.5.4 Diagrama de Ishikawa ...................................................................................... 22|
|1.6 Preguntas de investigación ................................................................................. 22|
|1.6.1 Pregunta general ............................................................................................. 23|
|1.6.2 Preguntas especifcas ..................................................................................... 23|
|1.6.3.1 Preguntas dirigidas a la hipótesis ................................................................... 23|
|1.6.3.2 Preguntas dirigidas al objetivo general ........................................................... 24|
|1.6.3.3 Preguntas dirigidas al objetivo específco ....................................................... 24|
|1.7 Objetivos ........................................................................................................... 25|
|1.7.1 Objetivo general .............................................................................................. 25|
|1.7.2 Objetivos específcos ...................................................................................... 25|
|1.8 Alcances ........................................................................................................... 26|



1 

|1.9 Limites .............................................................................................................. 27|
|---|
|CAPÍTULO II ................................................................................................................ 28|
|MARCO TEÓRICO ....................................................................................................... 28|
|2.1 Contenedores .................................................................................................... 28|
|2.1.1 Docker ............................................................................................................ 28|
|2.1.2 Máquinas virtuales .......................................................................................... 29|
|2.1.3 Podman .......................................................................................................... 29|
|2.1.4 Containerd ..................................................................................................... 30|
|2.2 Orquestación ..................................................................................................... 31|
|2.2.1 Kubernetes ..................................................................................................... 31|
|2.2.2 Infraestructura como código (IAC) .................................................................... 31|
|2.2.3 Microservicios ................................................................................................. 32|
|2.2.4 Arquitectura de capas o hexagonal ................................................................... 33|
|2.3 Despliegue automatizado ................................................................................... 33|
|2.3.1 Pipelines ......................................................................................................... 34|
|2.3.2 CI/CD ............................................................................................................. 34|
|2.3.3 Acciones de GitHub ......................................................................................... 34|
|2.3.4 Idempotencia ................................................................................................. 34|
|2.4 Monitoreo .......................................................................................................... 35|
|2.4.1 Estado de servicios ......................................................................................... 35|
|2.4.2 Alertas ............................................................................................................ 36|
|2.4.3 Acciones automáticas ..................................................................................... 36|
|2.4.4 Observabilidad................................................................................................ 36|
|2.5 Interfaz .............................................................................................................. 37|
|2.5.1 Aprendizaje visual ........................................................................................... 37|
|2.5.2 Interacción simple ........................................................................................... 37|
|2.5.3 Prevención de errores ...................................................................................... 38|
|2.6 Aprendizaje ....................................................................................................... 38|
|2.6.1 Ruta de aprendizaje ......................................................................................... 38|



2 

|2.6.2 Módulos ......................................................................................................... 39|
|---|
|2.6.3 Material didáctico ........................................................................................... 39|
|2.6.4 Carga cognitiva ............................................................................................... 39|
|2.6.5 Aprendizaje Basado en la Experimentación ....................................................... 40|
|2.6.6 Andamiaje (Scafolding) ................................................................................... 40|
|2.6.7 Entornos de aprendizaje virtuales (Learning Platforms) ...................................... 41|
|2.7 Evaluación ......................................................................................................... 41|
|2.7.1 Actividades de aprendizaje .............................................................................. 41|
|2.7.2 Exámenes ....................................................................................................... 42|
|2.7.3 Evaluación práctica ......................................................................................... 42|
|CAPÍTULO III ............................................................................................................... 43|
|MARCO METODOLOGICO ........................................................................................... 43|
|3.1 Diseño de la investigación .................................................................................. 43|
|3.2 Enfoque de la investigación ................................................................................ 43|
|3.3 Población .......................................................................................................... 43|
|3.4 Muestra y muestreo ............................................................................................ 44|
|3.5 Técnicas de recolección de datos ........................................................................ 44|
|3.6 Instrumentos de recolección de datos ................................................................. 45|
|3.7 Técnicas de procesamiento de datos ................................................................... 45|
|3.8 Herramientas para el procesamiento de datos ..................................................... 45|
|3.9 Nivel de confanza .............................................................................................. 45|
|3.10 Hipótesis ......................................................................................................... 46|
|3.11 Variable de estudio ........................................................................................... 46|
|3.11.1 Variable independiente .................................................................................. 46|
|3.11.2 Variable dependiente ..................................................................................... 46|
|3.11.3 Operacionalidad de las variables .................................................................... 46|
|3.11.4 Organizador gráfco ....................................................................................... 47|
|3.12 Supuestos ....................................................................................................... 49|
|3.12.1 Fortalezas ..................................................................................................... 49|



3 

|3.12.2 Oportunidades .............................................................................................. 49|
|---|
|3.12.3 Debilidades................................................................................................... 49|
|3.12.4 Amenazas ..................................................................................................... 50|
|3.13 Delimitación del estudio ................................................................................... 50|
|3.14 Limitaciones del estudio ................................................................................... 51|
|3.15 Alcances metodológicos .................................................................................. 51|
|3.16 Técnicas de investigación ................................................................................. 52|
|3.16.1 Observación ................................................................................................. 52|
|3.16.2 Investigación documental .............................................................................. 52|
|3.16.3 Estudio de caso ............................................................................................. 53|
|3.17 Análisis de datos .............................................................................................. 53|
|3.17.1 Análisis de resultados de cuestionario inicial .................................................. 55|
|3.18 Análisis de factibilidad ...................................................................................... 56|
|3.18.1 Factibilidad técnica ....................................................................................... 56|
|3.18.1.1 Características del hardware ....................................................................... 56|
|3.18.1.1 Características del software ........................................................................ 57|
|3.18.2 Factibilidad económica ................................................................................. 58|
|3.18.2.1 Equipo para el proyecto ............................................................................... 58|
|3.18.2.2 Gastos totales ............................................................................................ 58|
|3.18.3 Factibilidad operativa .................................................................................... 59|
|3.18.4 Factibilidad legal ........................................................................................... 59|
|CAPITULO IV ............................................................................................................... 61|
|FASE DE DISEÑO ........................................................................................................ 61|
|4.1 Fase de diseño ................................................................................................... 61|
|4.1.1 Requerimientos funcionales ............................................................................ 61|
|4.1.2 Requerimientos no funcionales ........................................................................ 63|
|4.1.3 Arquitectura lógica del sistema ........................................................................ 65|
|4.1.3.1 Capa de presentación ................................................................................... 67|
|4.1.3.2 Capa de Lógica de Negocio ........................................................................... 69|



4 

|4.1.3.3 Capa de Servicios ......................................................................................... 71|
|---|
|4.1.3.4 Capa de Acceso a Datos ............................................................................... 72|
|4.1.3.5 Capa de Base de Datos ................................................................................. 74|
|4.1.4 Diagrama de la arquitectura ............................................................................. 76|
|4.1.5 Identifcar las clases ........................................................................................ 78|
|4.1.6 Especifcación de los requerimientos del software ............................................ 80|
|4.1.6.1 Funciones del proyecto ................................................................................. 81|
|4.1.6.1.1 Requerimientos funcionales ....................................................................... 82|
|4.1.6.1.2 Requerimientos no funcionales. ................................................................. 87|
|4.1.7 Características del usuario .............................................................................. 93|
|4.1.7.1 Estudiante en formación ............................................................................... 93|
|4.1.7.2 Administrador docente ................................................................................. 94|
|4.1.7.3 Investigador ................................................................................................. 95|
|4.1.8 Diagramas y especifcaciones de caso de uso ................................................... 97|
|4.1.9 Matriz de requerimientos ............................................................................... 104|
|4.1.9.1 Matriz de trazabilidad de requerimientos funcionales ................................... 105|
|4.1.9.2 Matriz de trazabilidad de requerimientos no funcionales ............................... 106|
|4.1.9.3 Distribución de los requerimientos por categoría .......................................... 107|
|4.1.10 Diagrama de contexto .................................................................................. 108|
|4.1.11 Diagrama de clases ..................................................................................... 109|
|4.1.12 Diagrama de actividades .............................................................................. 112|
|4.1.13 Diagrama de secuencia ............................................................................... 113|
|4.1.14 Diagramas de estado ................................................................................... 115|
|4.1.15 Diagrama de interfaz de usuario ................................................................... 117|
|4.1.16 Diagrama de componentes .......................................................................... 119|
|4.1.17 Diagrama ER ............................................................................................... 123|
|4.1.18 Diseño de vistas (mockups) .......................................................................... 127|



5 

# **INTRODUCCIÓN** 

La administración moderna de infraestructura tecnológica ha experimentado una transformación profunda durante la última década, desplazándose desde modelos basados en la configuración manual de servidores hacia esquemas sustentados en la contenedorización, la automatización y la orquestación de servicios. Tecnologías como Docker y Kubernetes han redefinido los estándares de despliegue en entornos productivos, permitiendo niveles de eficiencia, portabilidad y control de recursos que resultaban impensables bajo los paradigmas tradicionales. En este contexto, el dominio de las prácticas asociadas a la cultura DevOps ha dejado de ser una competencia complementaria para convertirse en un requisito fundamental dentro del perfil profesional del ingeniero en sistemas, dada la creciente demanda de recurso humano capacitado para gestionar arquitecturas de servicios modernas. 

No obstante, la incorporación de estas tecnologías en los procesos formativos universitarios no siempre ha estado acompañada de herramientas pedagógicas adecuadas que faciliten su comprensión progresiva. En el ámbito académico, el aprendizaje de la contenedorización y el despliegue automatizado suele depender de la ejecución directa de comandos en entornos de línea de comandos, de la lectura de documentación técnica y de la resolución de ejercicios guiados de forma aislada. Aunque este enfoque resulta funcional desde el punto de vista operativo, no necesariamente favorece la comprensión conceptual profunda, en especial entre estudiantes que se encuentran en etapas intermedias de su formación. El uso intensivo de la terminal exige precisión sintáctica y conocimiento previo, lo cual incrementa la carga cognitiva del estudiante y dificulta que este relacione cada operación con su efecto real sobre los recursos del servidor. 

De esta situación se deriva una brecha persistente entre el conocimiento teórico impartido en el aula y la experiencia práctica significativa, que limita el desarrollo de competencias sólidas en despliegue automatizado y gestión de servicios. El problema central que motiva el presente trabajo es, precisamente, la elevada curva de aprendizaje que un estudiante del área tecnológica debe superar para ejercer con solvencia en estas tecnologías. Dicha curva se ve acentuada por la complejidad técnica de las herramientas actuales, por la ausencia de plataformas concebidas con un enfoque didáctico explícito, por la limitada visualización del 

6 

impacto de las decisiones técnicas y por la dependencia de recursos formativos dispersos que rara vez integran teoría, práctica y evaluación dentro de un mismo entorno controlado. Como consecuencia, se produce una comprensión superficial de los conceptos fundamentales, episodios de desmotivación ante errores de configuración recurrentes y una mayor dependencia de perfiles altamente especializados, factores que en conjunto reducen la autonomía técnica de los futuros profesionales. 

Frente a esta problemática, el presente proyecto propone el diseño y desarrollo de una plataforma educativa para la gestión DevOps, dotada de una interfaz gráfica orientada a la experimentación controlada sobre servidores físicos. La plataforma busca simplificar la interacción con las herramientas comúnmente utilizadas en estos entornos, permitiendo que el usuario comprenda de forma visual y guiada conceptos esenciales como la creación de contenedores, la configuración de servicios, el despliegue automatizado y la supervisión del estado de los sistemas. Para ello, el sistema contempla funcionalidades como la creación guiada de servicios contenedorizados mediante formularios con validaciones automáticas, la verificación previa de la disponibilidad de recursos del servidor antes de cada despliegue, la visualización del estado y el consumo de los servicios activos y un componente de carácter educativo y evaluativo. Con este conjunto de capacidades se pretende reducir la complejidad asociada al uso exclusivo de la línea de comandos y trasladar el foco del aprendizaje desde la memorización de instrucciones hacia la comprensión de los procesos subyacentes. 

El propósito general de la investigación consiste en desarrollar dicha plataforma con el fin de facilitar el aprendizaje de tecnologías de contenedorización, despliegue automatizado y monitoreo básico de recursos, reduciendo la dificultad inicial asociada a las herramientas basadas en línea de comandos y mejorando la comprensión práctica de estos conceptos en contextos educativos. Más allá de su dimensión tecnológica, el proyecto incorpora una intención pedagógica explícita: al integrar una interfaz que hace visible el impacto de cada decisión, se crea un entorno en el cual el estudiante puede relacionar la teoría con la práctica de manera inmediata, comprender la asignación de recursos y consolidar su conocimiento mediante la experimentación directa. 

7 

Esta naturaleza dual, técnica y educativa a la vez, confiere al trabajo un carácter investigativo que trasciende la simple construcción de un sistema. Para valorar la efectividad de la herramienta propuesta, el estudio adopta un diseño cuasiexperimental con enfoque comparativo, en el cual se contrasta el desempeño de un grupo experimental que utiliza la plataforma desarrollada frente al de un grupo control que realiza las mismas tareas mediante herramientas tradicionales basadas en línea de comandos. La hipótesis que orienta la investigación sostiene que el uso de la plataforma permite reducir de manera apreciable el tiempo promedio de despliegue y mejorar el desempeño práctico de los estudiantes en tareas de configuración y despliegue de servicios contenedorizados. De este modo, el proyecto no solo aporta una solución tecnológica concreta, sino también una contribución metodológica al proceso de enseñanza y aprendizaje en el área de infraestructura y DevOps. 

El alcance del trabajo se circunscribe al desarrollo de un prototipo funcional con fines educativos, dirigido principalmente a estudiantes universitarios de Ingeniería en Sistemas y a profesionales en formación dentro del área de tecnología. En consecuencia, la plataforma no pretende reemplazar las herramientas profesionales empleadas en entornos empresariales de producción, ni incorporar funcionalidades avanzadas como la orquestación a gran escala, la integración con múltiples proveedores de nube o los sistemas sofisticados de monitoreo, las cuales quedan deliberadamente fuera de los límites del proyecto. La evaluación del sistema se realiza en entornos de laboratorio y mediante una muestra acotada, lo que delimita la generalización de los resultados, pero resulta coherente con la naturaleza académica de la investigación y con los recursos disponibles para su ejecución. 

En términos institucionales, la implementación de esta plataforma fortalece la capacidad del centro universitario para ofrecer formación práctica basada en tecnologías actuales, optimiza el uso de los servidores físicos disponibles y promueve la adquisición temprana de competencias demandadas por el mercado laboral. Con ello, el proyecto se alinea con los objetivos curriculares del programa académico y aporta evidencia que puede orientar futuras decisiones sobre la incorporación de herramientas didácticas en la enseñanza de la infraestructura tecnológica. 

8 

El presente documento se organiza en cuatro capítulos que reflejan la progresión lógica de la investigación, desde la conceptualización del problema hasta el diseño de la solución. El Capítulo I, denominado Marco Conceptual, establece los antecedentes del proyecto mediante el análisis de herramientas existentes, expone la justificación del estudio, describe el problema junto con sus causas y consecuencias, y formula las preguntas de investigación, los objetivos, los alcances y los límites que delimitan el trabajo. El Capítulo II, correspondiente al Marco Metodológico, detalla el diseño cuasiexperimental adoptado, el enfoque de la investigación, la población y la muestra, las técnicas e instrumentos de recolección y procesamiento de datos, la hipótesis, las variables de estudio y el análisis de factibilidad técnica, económica, operativa y legal. El Capítulo III, dedicado al Marco Teórico, desarrolla los fundamentos conceptuales que sustentan el proyecto, abordando la contenedorización, la orquestación, el despliegue automatizado, el monitoreo, el diseño de interfaces y los principios de aprendizaje y evaluación que orientan el componente pedagógico de la plataforma. Por último, el Capítulo IV, correspondiente a la Fase de Diseño, traduce los requerimientos identificados en especificaciones técnicas concretas, presentando los requerimientos funcionales y no funcionales, la arquitectura lógica por capas, el modelo del dominio, las especificaciones formales del software, los diagramas que describen el comportamiento del sistema, el modelo de datos y el diseño de las vistas que conforman la interfaz de usuario. 

En conjunto, estos capítulos articulan un recorrido coherente que parte de la identificación de una necesidad formativa real, la fundamenta teórica y metodológicamente, y desemboca en el diseño de una herramienta concebida para reducir la curva de aprendizaje, fortalecer la comprensión conceptual y mejorar la calidad del proceso formativo en el ámbito de la Ingeniería en Sistemas. 

9 

# **CAPÍTULO I** 

# **MARCO CONCEPTUAL** 

# **1.1 Antecedentes** 

En años recientes, el uso de contenedores y la orquestación de servicios se han establecido como prácticas fundamentales en la gestión moderna de los recursos tecnológicos. Estos permiten el uso eficiente y optimo de los recursos disponibles, así como una alta disponibilidad de servicio. A este comúnmente se le conoce como nivel de calidad del servicio o simplemente nivel de servicio. 

La solución más representativa de esta tecnología es Docker, plataforma que introdujo un modelo estandarizado para la creación y ejecución de aplicaciones en contenedores. Aunque Docker facilita la portabilidad y aislamiento de aplicaciones, su utilización tradicional requiere conocimientos técnicos sobre configuración de imágenes, redes, volúmenes y asignación de recursos, lo cual puede representar una barrera inicial para estudiantes o administradores con experiencia limitada. 

En el desarrollo y uso de estas tecnologías de infraestructura, han surgido herramientas tecnológicas especializadas con el objetivo de simplificar la gestión de contenedores y automatizar el despliegue de servicios, reduciendo la dependencia exclusiva de la línea de comandos. 

Aunque estas herramientas buscan simplificar el trabajo con contenedores no es su fin u objetivo el educar al usuario o aprendiz sobre los conceptos base y toda la tecnología que gestiona. La tecnología de contenedorización es por su naturaleza esencial para la sociedad moderna en la que vivimos y es imperativo poseer recurso humano altamente capacitado para su gestión. El problema abordado en el presente proyecto es la elevada curva de aprendizaje que un estudiante o aprendiz del área tecnológica, como programador o administrador de sistemas, debe superar para poder ejercer como profesional en estas tecnologías. 

Las herramientas listadas a continuación son los sistemas que más se asemejan conceptualmente a lo desarrollado en este proyecto, aunque ninguna tiene como enfoque 

10 

principal el capacitar y desarrollar el talento humano necesario para la gestión de dicha tecnología. 

# **1.1.1 Portainer** 

Entre las herramientas que buscan simplificar la administración de contenedores destaca Portainer, una plataforma que proporciona una interfaz gráfica para la gestión de entornos basados en Docker y Kubernetes. Portainer permite visualizar contenedores activos, imágenes disponibles, redes, volúmenes y configuraciones desde un entorno web intuitivo, reduciendo la necesidad de interacción directa con la línea de comandos. Su arquitectura ligera facilita su instalación incluso en servidores de pequeña escala. 

Además, Portainer incorpora funcionalidades como la implementación de aplicaciones mediante plantillas, gestión de pilas basados en Docker Compose y control de accesos por usuario. Estas características lo convierten en una herramienta ampliamente utilizada en entornos productivos y de desarrollo, especialmente cuando se requiere simplificar la operación cotidiana de infraestructura contenedorizada. 

Sin embargo, aunque Portainer reduce la complejidad operativa, su diseño está orientado principalmente a la administración eficiente de servicios y no a la enseñanza estructurada de los principios fundamentales de la contenedorización. La plataforma abstrae gran parte del proceso técnico sin necesariamente explicar los conceptos subyacentes, lo que limita su valor pedagógico en etapas iniciales de formación. 

# **1.1.2 Rancher** 

Otra solución relevante es Rancher, plataforma diseñada para la administración centralizada de clústeres Kubernetes. Rancher permite gestionar múltiples entornos desde una única interfaz gráfica, facilitando la creación, escalado y monitoreo de cargas de trabajo distribuidas. Su enfoque se centra en simplificar la complejidad inherente a la orquestación de contenedores en entornos empresariales. 

Rancher incorpora mecanismos avanzados de control de acceso, políticas de seguridad, gestión de proyectos y monitoreo integrado. Estas capacidades lo posicionan como una 

11 

solución robusta para organizaciones que operan infraestructuras de gran escala o requieren alta disponibilidad y escalabilidad horizontal. 

No obstante, su arquitectura está orientada a escenarios de producción con múltiples nodos y clústeres, lo cual introduce un nivel de complejidad técnica considerable. Para un estudiante que se inicia en la contenedorización, el uso de Rancher puede resultar abrumador debido a la cantidad de componentes y configuraciones involucradas, alejándose del objetivo formativo de comprender los fundamentos antes de abordar entornos distribuidos complejos. 

# **1.1.3 Kubernetes Dashboard** 

En el ecosistema Kubernetes, el Kubernetes Dashboard constituye la interfaz gráfica oficial para la visualización y administración de recursos dentro de un clúster. Esta herramienta permite observar el estado de contenedores, despliegues, servicios y volúmenes persistentes, así como crear o modificar recursos mediante formularios web. 

El Dashboard facilita la comprensión visual de la arquitectura interna de Kubernetes, ofreciendo una representación estructurada de los componentes desplegados. Además, integra métricas básicas que permiten supervisar el consumo de recursos y el estado general del sistema. 

Sin embargo, el uso del Kubernetes Dashboard presupone la existencia previa de un clúster correctamente configurado, lo cual implica conocimientos avanzados sobre redes, nodos, controladores y configuración de seguridad. Por tanto, aunque ofrece una abstracción visual, no elimina la complejidad inicial asociada a la instalación y mantenimiento del entorno. 

# **1.1.4 Cockpit y Swarmpit** 

Dentro de las herramientas auxiliares de administración gráfica se encuentran Cockpit y Swarmpit. Cockpit es una herramienta de gestión de servidores Linux que permite administrar servicios del sistema, contenedores y recursos del host mediante una interfaz web. Su objetivo principal es simplificar la administración general del servidor, incluyendo monitoreo de rendimiento y control de servicios. 

12 

Por su parte, Swarmpit está orientado específicamente a entornos Docker Swarm, proporcionando una interfaz gráfica para la gestión de servicios, nodos y pilas dentro de un clúster Swarm. Esta herramienta facilita la visualización del estado de los servicios desplegados y la configuración de parámetros operativos sin recurrir a comandos directos. 

Ambas soluciones contribuyen a reducir la fricción operativa en la administración de contenedores; sin embargo, al igual que las plataformas anteriormente descritas, están concebidas como herramientas de gestión y no como sistemas educativos estructurados. Su finalidad es optimizar la operación, no necesariamente fortalecer la comprensión conceptual del usuario en proceso de formación. 

# **1.1.5 ManageIQ** 

Finalmente, ManageIQ representa una plataforma más amplia de gestión de infraestructura tecnológica. Esta herramienta permite administrar entornos heterogéneos que pueden incluir máquinas virtuales, contenedores y servicios en la nube, ofreciendo funcionalidades de automatización, catálogo de servicios y monitoreo centralizado. 

ManageIQ incorpora capacidades de gobierno de infraestructura, control de cumplimiento normativo y automatización basada en políticas. Su diseño responde a necesidades empresariales complejas en las que múltiples recursos tecnológicos deben ser gestionados de forma integrada y estandarizada. 

No obstante, su amplitud funcional y arquitectura avanzada la posicionan fuera del alcance práctico de entornos educativos iniciales. La implementación y operación de ManageIQ requieren conocimientos especializados y una infraestructura considerable, lo que refuerza la necesidad de soluciones más ligeras y pedagógicamente orientadas. 

# **1.1.6 Conclusiones de los antecedentes** 

En síntesis, las herramientas analizadas comparten el objetivo de facilitar la administración y despliegue de servicios contenedorizados mediante interfaces gráficas y mecanismos de automatización. Sin embargo, ninguna de ellas tiene como propósito central reducir la curva de aprendizaje en contextos académicos ni estructurar el proceso formativo de estudiantes que 

13 

se inician en tecnologías de contenedorización y orquestación. Esta brecha constituye el espacio conceptual en el cual se enmarca el presente proyecto. 

Existen alternativas pedagógicas tradicionales dedicas al aprendizaje de estas tecnologías, pero a diferencia de los cursos en línea, tutoriales interactivos o plataformas de aprendizaje digital existentes, el presente proyecto propone un entorno de experimentación real dentro de una infraestructura física controlada. Mientras que muchos recursos educativos se basan en simulaciones o laboratorios virtuales preconfigurados, la plataforma propuesta permite a los estudiantes interactuar directamente con un servidor real, observando el comportamiento auténtico del consumo de recursos, la creación de redes y la ejecución de servicios contenedorizados. Esta experiencia práctica fortalece la comprensión técnica más allá del conocimiento teórico. 

Los cursos tradicionales y plataformas web suelen estructurarse bajo un modelo instruccional secuencial, donde el estudiante sigue instrucciones paso a paso sin necesariamente comprender el impacto sistémico de cada acción. En contraste, el sistema propuesto integra validaciones, visualización de recursos y monitoreo en tiempo real, permitiendo que el estudiante relacione cada decisión de configuración con sus efectos en el entorno. Este enfoque fomenta un aprendizaje contextual y reflexivo en lugar de meramente procedimental. 

Otra ventaja significativa radica en la integración del proceso educativo con el entorno institucional. Muchas plataformas externas operan en infraestructuras en la nube que abstraen completamente la administración del host subyacente. Si bien esto facilita el acceso, también elimina la oportunidad de comprender cómo interactúan los servicios con los recursos físicos reales del servidor. El proyecto planteado permite visualizar directamente la asignación de CPU, memoria y almacenamiento dentro del entorno universitario, fortaleciendo la comprensión de la relación entre software e infraestructura. 

Adicionalmente, la mayoría de los cursos disponibles en línea están diseñados para audiencias globales y generalizadas, lo que limita su capacidad de adaptación a contextos específicos de una institución académica. La plataforma desarrollada en este proyecto puede 

14 

ajustarse a los contenidos curriculares del programa de estudios, alineándose con los objetivos formativos del curso y permitiendo evaluaciones experimentales comparativas entre metodologías tradicionales y la herramienta propuesta. Esto la convierte en un instrumento pedagógico adaptable y medible. 

Finalmente, el valor diferencial del proyecto no reside únicamente en la automatización del despliegue, sino en la combinación de automatización con propósito formativo. La herramienta no busca reemplazar la línea de comandos ni simplificar excesivamente la tecnología, sino servir como puente entre la complejidad técnica y la comprensión conceptual. De esta manera, el sistema actúa como un facilitador de aprendizaje progresivo, permitiendo que el estudiante adquiera confianza inicial antes de enfrentarse a entornos de mayor complejidad técnica. 

# **1.2 Cuadro Comparativo** 

El siguiente cuadro resume las principales características de las herramientas analizadas en los antecedentes, contrastándolas con la plataforma educativa propuesta, enfatizando sus ventajas y limitaciones desde una perspectiva pedagógica. 

15 

# **Tabla 1** 

Cuadro comparativo entre la solución tecnológica propuesta y las herramientas disponibles en el mercado nacional e internacional actualmente. 

|**Herramienta**|<sup>**Enfoque**</sup><br>**Principal**|**Ventajas**|**Desventajas**<br>**desde el enfoque**<br>**pedagógico**|<br>**Diferencia respecto**<br>**al proyecto**<br>**propuesto**|
|---|---|---|---|---|
|**Portainer**|Administración<br>gráfica de<br>entornos Docker<br>y Kubernetes|<br>Interfaz intuitiva,<br>despliegue<br>mediante plantillas,<br>gestión de usuarios,<br>instalación ligera|<br> <br>Abstrae procesos<br>técnicos sin<br>estructurar el<br>aprendizaje<br>conceptual; no<br>incluye ruta<br>formativa|<br>El proyecto integra<br>visualización y<br>explicación<br>progresiva de<br>conceptos, no solo<br>administración|
|**Rancher**|Gestión<br>centralizada de<br>clústeres<br>Kubernetes|Alta escalabilidad,<br>control de acceso<br>avanzado,<br>monitoreo<br>integrado|Arquitectura<br>compleja para<br>principiantes;<br>orientado a<br>producción<br>empresarial|El proyecto prioriza<br>comprensión de<br>fundamentos antes<br>de abordar entornos<br>distribuidos<br>complejos|
|**Kubernetes**<br>**Dashboard**|Interfaz oficial<br>para<br>administración<br>de recursos<br>Kubernetes|Visualización<br>estructurada del<br>clúster, métricas<br>básicas integradas|Requiere clúster<br>previamente<br>configurado;<br>presupone<br>conocimientos<br>avanzados|El proyecto reduce<br>la barrera inicial al<br>integrar instalación,<br>monitoreo y<br>aprendizaje guiado|
|**Cockpit**|Administración<br>general de<br>servidores Linux|<br>Monitoreo del<br>sistema, gestión de<br>servicios y<br>contenedores|No está diseñado<br>como entorno<br>formativo;<br>enfoque<br>operativo general|<br> <br>El proyecto vincula<br>la administración<br>con objetivos<br>curriculares<br>específicos|
|**Swarmpit**|Gestión gráfica<br>de Docker<br>Swarm|Visualización de<br>nodos y servicios,|Limitado a<br>Swarm; no<br>integra|El proyecto<br>incorpora módulos,<br>actividades y|



16 

|**Herramienta**|<sup>**Enfoque**</sup><br>**Principal**|**Ventajas**|**Desventajas**<br>**desde el enfoque**<br>**pedagógico**|<br>**Diferencia respecto**<br>**al proyecto**<br>**propuesto**|
|---|---|---|---|---|
|||simplificación<br>operativa|contenidos<br>educativos<br>estructurados|evaluación<br>pedagógica|
|**ManageIQ**|Gestión integral<br>de<br>infraestructura<br>híbrida|Automatización<br>basada en políticas,<br>gobierno de<br>infraestructura,<br>monitoreo<br>centralizado|Complejidad<br>elevada; requiere<br>infraestructura<br>considerable; no<br>orientado a<br>formación inicial|<br> <br>El proyecto es<br>ligero, enfocado en<br>aprendizaje<br>progresivo y<br>experimentación<br>controlada|
|**Proyecto**<br>**propuesto**|Plataforma<br>educativa para<br>gestión DevOps|Integración de<br>despliegue real,<br>monitoreo en<br>tiempo real,<br>validaciones, ruta<br>de aprendizaje<br>estructurada,<br>alineación<br>curricular|No orientado a<br>producción<br>empresarial de<br>gran escala|Enfoque pedagógico<br>explícito, diseñado<br>para reducir la curva<br>de aprendizaje y<br>fortalecer la<br>comprensión<br>conceptual|



_Nota_ . El proyecto propuesto cubre una gran grieta en el mercado laboral y académico actual cuya importancia tiene implicaciones directas con el desarrollo y crecimiento de la sociedad. Fuente propia. 

# **1.3 Mapa Mental** 

El siguiente mapa mental busca ejemplificar de forma gráfica los conceptos básicos asociados al proyecto dando claridad a la relación entre sí. 

17 



<!-- Start of picture text -->
Contenedores Docker<br>Imagenes<br>Aprendizaje visual 1 Contenedorizacion<br>Recursos (CPU / RAM)<br>Formularios guiados<br>5 Interfaz Maquinas virtuales (comparacién)<br>Prevencion de errores<br>Gestion de servicios<br>Interaccién simple<br>Coordinacién automatica<br>Ruta de aprendizaje 2 Orquestacion<br>Kubernetes (referencia)<br>Médulos<br>6 Enfoque Educativo Infraestructura declarativa<br>Experimentacion real<br>Pipelines CI/CD<br>Relacién teoria—practica<br>3 Despliegue Automatizado GitHub Actions<br>Actividades practicas<br>Validacién previa<br>Examenes<br>7 Evaluacion Estado de servicios<br>Indicadores de éxito<br>Consumo de recursos<br>SE Saaee 4 Monitoreo<br>Alertas<br>Acciones automaticas<br><!-- End of picture text -->

recursos mediante línea de comandos puede generar frustración y desmotivación en estudiantes que aún no dominan los fundamentos de la administración de sistemas. Esta situación puede provocar que el proceso formativo se enfoque en la ejecución mecánica de comandos, sin garantizar una comprensión profunda de los principios que sustentan la contenedorización y la automatización. 

Si bien existen herramientas gráficas de administración que simplifican la operación técnica, estas están diseñadas principalmente para entornos productivos y no para el acompañamiento pedagógico. La mayoría de las plataformas actuales priorizan la eficiencia operativa sobre la construcción progresiva del conocimiento, dejando un vacío en el ámbito educativo: la ausencia de una herramienta que combine despliegue real, monitoreo y validación de recursos con una estructura formativa intencionada. 

El presente proyecto se justifica en la necesidad de reducir la brecha entre la complejidad técnica de la infraestructura moderna y la capacidad de aprendizaje progresivo del estudiante. Al integrar una interfaz gráfica orientada a la experimentación controlada en un servidor físico real, se crea un entorno donde el alumno puede visualizar el impacto de sus decisiones, comprender la asignación de recursos y relacionar teoría con práctica de manera inmediata. 

Asimismo, la implementación de esta plataforma dentro del contexto universitario permite alinear la herramienta con los objetivos curriculares del programa académico, facilitando evaluaciones experimentales que midan su efectividad en comparación con metodologías tradicionales. De esta forma, el proyecto no solo aporta una solución tecnológica, sino también una contribución metodológica al proceso de enseñanza-aprendizaje en el área de infraestructura y DevOps. 

En términos institucionales, la plataforma propuesta fortalece la capacidad del centro universitario para ofrecer formación práctica basada en tecnologías actuales, optimizando el uso de servidores físicos disponibles y promoviendo la adquisición temprana de competencias demandadas por el mercado laboral. Esto contribuye al desarrollo de profesionales mejor preparados para enfrentar los desafíos de la administración moderna de sistemas. 

19 

En síntesis, la justificación del proyecto radica en su capacidad para integrar tecnología, automatización e intención pedagógica en una sola herramienta, orientada a reducir la curva de aprendizaje, fortalecer la comprensión conceptual y mejorar la calidad del proceso formativo en Ingeniería en Sistemas. 

# **1.5 Descripción del problema** 

La administración moderna de infraestructura tecnológica ha evolucionado hacia modelos basados en contenedorización, automatización y orquestación de servicios. Tecnologías como Docker y Kubernetes han redefinido los estándares de despliegue en entornos productivos, permitiendo mayor eficiencia, escalabilidad y control de recursos. Sin embargo, la incorporación de estas tecnologías en los procesos formativos universitarios no siempre ha sido acompañada de herramientas pedagógicas adecuadas que faciliten su comprensión progresiva. 

En el contexto académico, el aprendizaje de estas tecnologías suele depender principalmente de la ejecución de comandos en entornos de línea de comandos, la lectura de documentación técnica y la resolución de ejercicios guiados. Aunque este enfoque es funcional desde el punto de vista técnico, no necesariamente favorece la comprensión conceptual profunda, especialmente en estudiantes que se encuentran en etapas intermedias de formación. 

Esta situación genera una brecha entre el conocimiento teórico impartido en el aula y la experiencia práctica significativa, limitando el desarrollo de competencias sólidas en despliegue automatizado y gestión de servicios en servidores físicos. 

# **1.5.1 Causas del problema** 

Entre las principales causas que originan esta problemática se identifican las siguientes: 

Primero, la elevada complejidad técnica inherente a la configuración manual de contenedores, redes, volúmenes y asignación de recursos. El uso intensivo de línea de comandos exige precisión sintáctica y conocimiento previo, lo que incrementa la carga cognitiva del estudiante y puede dificultar la comprensión integral del proceso. 

20 

Segundo, la ausencia de herramientas educativas diseñadas específicamente para el aprendizaje progresivo de la contenedorización y la automatización. Las plataformas existentes están orientadas a entornos empresariales y priorizan la eficiencia operativa sobre la didáctica. 

Tercero, la limitada visualización del impacto de las decisiones técnicas. En muchos casos, el estudiante ejecuta comandos sin comprender plenamente cómo afectan los recursos del servidor físico, el consumo de memoria o el estado real de los servicios desplegados. 

Cuarto, la dependencia excesiva de documentación externa, tutoriales fragmentados y cursos aislados que no siempre integran teoría, práctica y evaluación dentro de un mismo entorno controlado. 

# **1.5.2 Problema** 

Existe una elevada curva de aprendizaje en el proceso de formación de estudiantes en tecnologías de contenedorización, orquestación y despliegue automatizado de servicios, debido a la complejidad técnica de las herramientas actuales y a la falta de plataformas con enfoque pedagógico que integren experimentación práctica, visualización de recursos y acompañamiento formativo en un entorno unificado. 

# **1.5.3 Consecuencias** 

Como resultado de esta problemática, se generan diversas consecuencias en el proceso formativo. 

En primer lugar, se observa una comprensión superficial de los conceptos fundamentales relacionados con la infraestructura moderna, donde el estudiante aprende a ejecutar procedimientos sin interiorizar completamente su funcionamiento. 

En segundo lugar, se produce desmotivación o frustración ante errores técnicos recurrentes derivados de configuraciones incorrectas, lo que puede afectar la continuidad del aprendizaje. 

En tercer lugar, se incrementa la dependencia de perfiles altamente especializados para la administración de servidores físicos, reduciendo la autonomía técnica de futuros profesionales. 

21 



<!-- Start of picture text -->
2 = METODOLOGIA DE ENSENANZA 1 _. TECNOLOGIA<br>yf Enfoque centrado en comandos y 38 Complejidad sintactica de<br>no en comprensién conceptual herramientas como Docker<br>© Escasa integracién entre teoria © Configuracién manual avanzada<br>y practica<br>@ Ausencia7  de simulacién- =  guiada: @ Multiplité c idadnicos de simultaneos conceptos<br>@ Falta de herramientas ul Falta de visualizacion grafica<br>didacticas interactivas del consumo de recursos @ PROBLEMA CENTRAL<br>‘\>] Evaluaciéni  centrada en © Dependencianl  de linea-  de ( EFECTO):<br>resultados y no en proceso comandos ELEVADA CURVA DE<br>APRENDIZAJE EN<br>TECNOLOGIAS DE<br>© Conocimientos previos {@ Limitado_.  acceso a entornos CONTENEDORIZACIONDESPLIEGUE Y<br>& Curriculos que incorporan heterogéneos de prueba controlados= AUTOMATIZADO<br>tecnologia moderna sin herramientas itive inici: | Infraestructura fisica<br>pedagégicas adecuadas @ Alta carga cognitiva inicial subutilizada<br>@ Falta de integracion entre { Dificultad para interpretar @ Falta de plataformas edu-<br>asignaturas teoricas y practicas errores técnicos cativas especializadas<br> Escasez de instrumentos de @ Frustracién ante fallos [)) Dependencia de docu-<br>medicin del aprendizaje aplicado ____ de configuracion mentacion externa dispersa<br>5 ff! ENTORNO INSTITUCIONAL 4 ¥. ESTUDIANTES 3 _ RECURSOS TECNOLOGICOS<br><!-- End of picture text -->

# **1.6.1 Pregunta general** 

La pregunta general establece el eje central de la investigación y orienta el desarrollo del estudio hacia la comprensión del problema principal. 

¿De qué manera una plataforma educativa con interfaz gráfica para la gestión y despliegue automatizado de servicios en servidores físicos puede reducir la curva de aprendizaje en tecnologías de contenedorización y administración de infraestructura en estudiantes de Ingeniería en Sistemas? 

# **1.6.2 Preguntas especificas** 

Las preguntas específicas permiten descomponer la pregunta general en aspectos más concretos que facilitan el análisis detallado del problema. 

- a) ¿Cuáles son las principales dificultades que enfrentan los estudiantes al aprender tecnologías de contenedorización y despliegue automatizado de servicios 

- b) ¿Cómo influye el uso de herramientas basadas exclusivamente en línea de comandos en el proceso de aprendizaje de estas tecnologías? 

- c) ¿De qué manera una interfaz gráfica puede facilitar la comprensión del despliegue de servicios y la administración de recursos en un servidor? 

- d) ¿Qué impacto tiene la visualización del consumo de recursos y del estado de los servicios en la comprensión conceptual de la infraestructura tecnológica? 

- e) ¿Puede una plataforma educativa que integre automatización, monitoreo y guía pedagógica mejorar la experiencia de aprendizaje en comparación con métodos tradicionales? 

# **1.6.3.1 Preguntas dirigidas a la hipótesis** 

Estas preguntas buscan obtener información que permita determinar si la plataforma educativa propuesta contribuye a reducir la curva de aprendizaje en el uso de tecnologías de contenedorización y despliegue automatizado. 

23 

- a) ¿Considera que el uso de una interfaz gráfica facilita la comprensión del proceso de despliegue de servicios en comparación con el uso exclusivo de comandos? 

- b) ¿La visualización del estado de los servicios y del consumo de recursos le ayudó a comprender mejor el funcionamiento del servidor? 

- c) ¿La plataforma le permitió entender con mayor claridad los conceptos relacionados con contenedores y servicios? 

- d) ¿Considera que una herramienta como la propuesta puede facilitar el aprendizaje inicial de tecnologías de infraestructura y DevOps? 

- e) En comparación con métodos tradicionales de aprendizaje, ¿considera que esta plataforma mejora la experiencia educativa? 

# **1.6.3.2 Preguntas dirigidas al objetivo general** 

Estas preguntas buscan obtener información que permita comprender si la plataforma contribuye al propósito principal del proyecto. 

- a) ¿Considera que la plataforma facilita la creación y despliegue de servicios en un servidor? 

- b) ¿La interfaz gráfica le permitió comprender de manera más clara el proceso de configuración de un servicio? 

- c) ¿La herramienta le ayudó a relacionar la teoría aprendida en clase con su aplicación práctica? 

- d) ¿Considera que la plataforma permite comprender mejor la relación entre los servicios desplegados y los recursos del servidor? 

# **1.6.3.3 Preguntas dirigidas al objetivo específico** 

Estas preguntas están orientadas a evaluar aspectos específicos del proceso de aprendizaje dentro de la plataforma. 

- a) ¿La plataforma le permitió comprender mejor el concepto de contenedores? 

- b) ¿La visualización del estado de los servicios facilitó la identificación de errores o fallos en el sistema? 

24 

- c) ¿Las validaciones y guías de la interfaz ayudaron a prevenir errores durante la configuración de servicios? 

- d) ¿El uso de la plataforma facilitó la comprensión de cómo se asignan recursos como CPU, memoria y almacenamiento a un servicio? 

- e) ¿Considera que esta herramienta podría utilizarse como apoyo en cursos relacionados con infraestructura o DevOps? 

# **1.7 Objetivos** 

Los objetivos acá presentes son el corazón del proyecto y el ideal que se espera lograr con el trabajo a realizar. 

# **1.7.1 Objetivo general** 

Desarrollar una plataforma educativa con interfaz gráfica que facilite el aprendizaje de tecnologías de contenedorización, despliegue automatizado de servicios y monitoreo básico de recursos en servidores físicos, con el propósito de reducir la dificultad inicial asociada al uso de herramientas basadas en línea de comandos y mejorar la comprensión práctica de estos conceptos en contextos educativos. 

# **1.7.2 Objetivos específicos** 

Los siguientes objetivos describen de forma clara, precisa y medible los puntos a alcanzar con el presente trabajo y que guiaran las rutas de acción para todos los pasos venideros. 

- a) Diseñar una interfaz gráfica que permita a los usuarios crear y configurar servicios contenedorizados mediante formularios guiados, incorporando validaciones automáticas que faciliten la correcta asignación de recursos y reduzcan errores de configuración. 

- b) Desarrollar un mecanismo que verifique la disponibilidad de recursos del servidor — como CPU, memoria y almacenamiento— antes del despliegue de los servicios, además de proporcionar visualización del estado y consumo de los servicios activos dentro de la plataforma. 

25 

- c) Analizar el efecto del uso de la plataforma en el proceso de aprendizaje mediante la aplicación del sistema a un grupo experimental de estudiantes, comparando su desempeño y nivel de comprensión frente a un grupo que utilice métodos tradicionales basados en herramientas de línea de comandos. 

# **1.8 Alcances** 

El presente proyecto tiene como alcance el diseño y desarrollo de una plataforma educativa orientada al aprendizaje de tecnologías de contenedorización, despliegue automatizado y monitoreo básico de servicios, dirigida principalmente a estudiantes universitarios de ingeniería en sistemas y profesionales en formación dentro del área de tecnología. 

La plataforma se enfocará en proporcionar una interfaz gráfica que simplifique la interacción con herramientas comúnmente utilizadas en entornos DevOps, permitiendo a los usuarios comprender de forma visual y guiada conceptos fundamentales como la creación de contenedores, la configuración de servicios, el despliegue automatizado y la supervisión del estado de los sistemas. Con ello se busca reducir la complejidad asociada al uso directo de herramientas basadas exclusivamente en línea de comandos. 

Dentro del desarrollo del proyecto se contempla la implementación de funcionalidades básicas que permitan crear servicios contenedorizados, validar recursos disponibles del sistema antes del despliegue, visualizar el estado de los servicios activos y presentar información básica sobre el consumo de recursos del servidor. Estas funciones estarán orientadas a facilitar la comprensión de los procesos involucrados en la administración de servicios modernos basados en contenedores. 

Asimismo, el proyecto incluirá un componente de evaluación educativa mediante la aplicación de la plataforma a un grupo reducido de usuarios pertenecientes al entorno académico o laboral del investigador, con el propósito de analizar su impacto en la comprensión de los conceptos abordados. Esta evaluación permitirá recopilar información que sirva como referencia para valorar la utilidad de la herramienta como recurso de aprendizaje. 

26 

Finalmente, el desarrollo del sistema se realizará dentro de un período aproximado de un año, contemplando las fases de investigación, diseño, implementación, pruebas y evaluación del prototipo funcional de la plataforma. 

# **1.9 Limites** 

El presente proyecto presenta ciertas limitaciones derivadas principalmente del alcance académico de la investigación, la disponibilidad de recursos y el tiempo establecido para su desarrollo. 

En primer lugar, la plataforma será desarrollada como un prototipo funcional con fines educativos, por lo que no pretende reemplazar herramientas profesionales utilizadas en entornos empresariales de producción. Su enfoque estará orientado principalmente a facilitar el aprendizaje de conceptos fundamentales relacionados con la contenedorización y el despliegue automatizado, más que a proporcionar una solución completa para la administración de infraestructura en entornos reales. 

Asimismo, debido a que el desarrollo del sistema será realizado por un único investigador y dentro de un periodo aproximado de un año, algunas funcionalidades avanzadas presentes en plataformas profesionales —como orquestación completa de contenedores a gran escala, integración con múltiples proveedores de nube o sistemas avanzados de monitoreo— no formarán parte del alcance del proyecto. 

Otra limitación relevante corresponde al tamaño de la muestra utilizada para la evaluación del sistema. Debido a restricciones logísticas y de acceso, las pruebas y encuestas se realizarán principalmente con estudiantes de la misma universidad o con profesionales cercanos al entorno laboral del investigador, lo cual podría limitar la generalización de los resultados a otros contextos educativos o institucionales. 

Finalmente, el proyecto estará sujeto a las restricciones de infraestructura disponibles para el investigador, utilizando recursos computacionales accesibles como equipos personales o servidores de pequeña escala, por lo que el sistema será evaluado en entornos de laboratorio o pruebas controladas y no en infraestructuras empresariales de gran capacidad. 

27 

# **CAPÍTULO II** 

# **MARCO TEÓRICO** 

Acá se presentan conceptos claves para la compresión contextual del proyecto, la problemática y su solución. Estos conceptos se han definido para evitar ambigüedades y posicionar el presente trabajo en el espacio conceptual correcto del basto campo de las tecnologías de la información y sistemas. 

# **2.1 Contenedores** 

Los contenedores constituyen una tecnología de virtualización a nivel de sistema operativo que permite empaquetar una aplicación junto con sus dependencias, bibliotecas y configuraciones necesarias para su ejecución en un entorno aislado. A diferencia de los métodos tradicionales de despliegue, los contenedores garantizan consistencia entre entornos de desarrollo, pruebas y producción, reduciendo conflictos derivados de diferencias en configuraciones del sistema. 

El aislamiento proporcionado por los contenedores se basa en mecanismos del sistema operativo como namespaces y cgroups, los cuales permiten separar procesos y controlar el uso de recursos como CPU y memoria. Este enfoque facilita una utilización más eficiente de los recursos físicos disponibles en comparación con modelos tradicionales de virtualización completa. 

En el contexto educativo, la tecnología de contenedores permite a los estudiantes experimentar con entornos reproducibles, seguros y controlados, favoreciendo la comprensión de arquitecturas modernas de software y prácticas DevOps. 

# **2.1.1 Docker** 

Docker es una plataforma de código abierto que popularizó el uso de contenedores mediante herramientas estandarizadas para su creación, distribución y ejecución. Docker introduce el concepto de imágenes, que actúan como plantillas inmutables a partir de las cuales se generan contenedores en ejecución. 

28 

La arquitectura de Docker se compone principalmente del Docker Engine, que gestiona la creación y ejecución de contenedores, y del Docker CLI, que permite interactuar con el sistema mediante comandos. Asimismo, Docker Hub funciona como repositorio público de imágenes preconstruidas, facilitando la reutilización y estandarización de entornos. 

Su relevancia radica en la simplificación del proceso de despliegue y en la portabilidad que ofrece entre diferentes sistemas operativos y servidores físicos, convirtiéndose en una herramienta fundamental en la administración moderna de servicios. 

# **2.1.2 Máquinas virtuales** 

Las máquinas virtuales (VM) representan un modelo de virtualización basado en la emulación completa de hardware físico mediante un hipervisor. Cada máquina virtual ejecuta su propio sistema operativo invitado, lo que proporciona un alto grado de aislamiento entre entornos. 

A diferencia de los contenedores, las máquinas virtuales requieren mayores recursos debido a la duplicación del sistema operativo en cada instancia. Esto implica mayor consumo de memoria y almacenamiento, así como tiempos de arranque más prolongados. 

No obstante, las VM ofrecen ventajas en términos de compatibilidad y seguridad aislada a nivel de kernel -núcleo de sistema operativo-, siendo ampliamente utilizadas en centros de datos y servicios en la nube. La comparación entre contenedores y máquinas virtuales es fundamental para comprender las decisiones arquitectónicas en sistemas modernos. 

# **2.1.3 Podman** 

Podman es una herramienta de código abierto utilizada para la creación, ejecución y administración de contenedores en sistemas operativos basados en Linux. Su diseño se basa en una arquitectura daemonless<sup>1</sup> , lo que significa que no requiere un servicio central en ejecución permanente para gestionar los contenedores, a diferencia de otras plataformas tradicionales de contenedorización. 

29 

Esta característica permite que cada contenedor sea ejecutado como un proceso independiente del sistema operativo, lo cual mejora aspectos relacionados con la seguridad, la gestión de permisos y el control del entorno de ejecución. Además, Podman es compatible con los estándares de la Open Container Initiative (OCI), lo que garantiza interoperabilidad con diferentes herramientas del ecosistema de contenedores. 

Desde una perspectiva educativa, Podman representa una alternativa relevante para el aprendizaje de tecnologías de contenedorización, ya que permite comprender de manera directa el funcionamiento de los contenedores sin depender de arquitecturas complejas. Su compatibilidad con comandos similares a los utilizados en otras herramientas facilita también la transición hacia entornos más avanzados. 

# **2.1.4 Containerd** 

Containerd es un sistema de ejecución de contenedores diseñado para gestionar el ciclo de vida completo de los contenedores, incluyendo la descarga de imágenes, la gestión del almacenamiento, la ejecución de procesos dentro de contenedores y la supervisión de su estado. 

Esta herramienta funciona como un runtime de contenedores de bajo nivel, proporcionando los mecanismos fundamentales necesarios para ejecutar contenedores de acuerdo con los estándares definidos por la Open Container Initiative. A diferencia de plataformas de nivel superior que incluyen interfaces de usuario y funcionalidades adicionales, containerd se enfoca exclusivamente en la ejecución eficiente y segura de contenedores. 

En muchos entornos modernos de infraestructura, containerd actúa como componente interno de plataformas de orquestación o sistemas de contenedorización más completos. Su arquitectura modular y ligera lo convierte en una solución ampliamente adoptada en infraestructuras de nube y entornos de producción. 

1 La arquitectura daemonless (sin demonio) es un diseño de motores de contenedores, como Podman, que elimina la necesidad de un proceso centralizado en segundo plano (demonio) para gestionar contenedores. 

30 

En contextos educativos, comprender el papel de containerd permite a los estudiantes distinguir entre las herramientas de alto nivel utilizadas para interactuar con contenedores y los componentes internos responsables de su ejecución. 

# **2.2 Orquestación** 

La orquestación es el proceso de coordinación automatizada de múltiples contenedores o servicios dentro de una infraestructura. Incluye tareas como despliegue, escalamiento, balanceo de carga, recuperación ante fallos y gestión de redes. 

En entornos productivos, la orquestación se vuelve indispensable cuando múltiples servicios interdependientes deben operar de manera conjunta y resiliente. Este proceso permite mantener la disponibilidad del sistema incluso ante fallas parciales. 

Desde una perspectiva formativa, comprender la orquestación permite a los estudiantes visualizar cómo interactúan los componentes de una arquitectura distribuida y cómo se automatiza su administración. 

# **2.2.1 Kubernetes** 

Kubernetes es un sistema de orquestación de contenedores de código abierto diseñado para automatizar el despliegue, escalado y gestión de aplicaciones contenedorizadas. Introduce conceptos como pods, deployments (“despliegues” en español), servicios y namespaces (“nombres de espacios” en español). 

Kubernetes opera bajo un modelo declarativo, donde el usuario define el estado deseado del sistema y el orquestador se encarga de mantenerlo. Esta filosofía permite alta disponibilidad, autorrecuperación y escalabilidad automática. 

Su adopción masiva en la industria lo convierte en un referente obligatorio dentro del estudio de infraestructura moderna y DevOps. 

# **2.2.2 Infraestructura como código (IAC)** 

La Infraestructura como Código, comúnmente conocida como IaC (Infrastructure as Code), es un enfoque de administración de infraestructura informática en el cual los recursos del 

31 

sistema —como servidores, redes, contenedores y configuraciones— se definen y gestionan mediante archivos de configuración o scripts versionados en lugar de realizarse manualmente. 

Este paradigma permite automatizar la creación, configuración y mantenimiento de infraestructuras tecnológicas utilizando herramientas que interpretan estos archivos y reproducen de forma consistente el estado deseado del sistema. Como resultado, se reduce la posibilidad de errores humanos, se mejora la reproducibilidad de los entornos y se facilita la integración con prácticas modernas de desarrollo y operaciones. 

La adopción de IaC es especialmente relevante en entornos DevOps, donde la automatización de la infraestructura permite implementar procesos de despliegue continuo, escalabilidad controlada y gestión eficiente de recursos. 

Desde una perspectiva educativa, el aprendizaje de IaC contribuye a que los estudiantes comprendan cómo las prácticas modernas de desarrollo de software integran la administración de infraestructura dentro del ciclo de vida del sistema. 

# **2.2.3 Microservicios** 

La arquitectura de microservicios es un estilo de diseño de software en el cual una aplicación se estructura como un conjunto de servicios pequeños, independientes y especializados que se comunican entre sí mediante interfaces bien definidas, generalmente a través de APIs. 

Cada microservicio se encarga de una funcionalidad específica del sistema y puede desarrollarse, desplegarse y escalarse de forma independiente. Esta característica permite una mayor flexibilidad en el desarrollo de aplicaciones complejas, facilitando la evolución del sistema y la incorporación de nuevas funcionalidades sin afectar necesariamente al resto de los componentes. 

El uso de microservicios está estrechamente relacionado con tecnologías de contenedorización y plataformas de despliegue automatizado, ya que estas herramientas permiten ejecutar múltiples servicios de manera aislada dentro de una misma infraestructura. 

32 

En el ámbito educativo, comprender la arquitectura de microservicios permite a los estudiantes analizar cómo las aplicaciones modernas se diseñan para mejorar su mantenibilidad, escalabilidad y resiliencia. 

# **2.2.4 Arquitectura de capas o hexagonal** 

La arquitectura de capas es un modelo de organización del software que divide el sistema en distintos niveles funcionales, donde cada capa cumple una responsabilidad específica dentro de la aplicación. Generalmente, estas capas incluyen la interfaz de usuario, la lógica de negocio y el acceso a datos. 

Por otro lado, la arquitectura hexagonal, también conocida como arquitectura de puertos y adaptadores, propone una estructura en la cual el núcleo de la aplicación —donde reside la lógica de negocio— permanece independiente de los mecanismos externos utilizados para interactuar con el sistema, como interfaces gráficas, bases de datos o servicios externos. 

Este enfoque busca mejorar la mantenibilidad, la flexibilidad y la capacidad de prueba del software al desacoplar la lógica central del sistema de las tecnologías utilizadas en su implementación. 

En proyectos educativos o experimentales, la adopción de este tipo de arquitectura facilita la evolución del sistema y permite modificar componentes externos sin afectar directamente al funcionamiento interno de la aplicación. 

# **2.3 Despliegue automatizado** 

El despliegue automatizado consiste en la ejecución sistemática y programada de procesos que permiten poner en funcionamiento una aplicación sin intervención manual directa. Esto reduce errores humanos y mejora la reproducibilidad. 

En entornos académicos, automatizar despliegues permite que el estudiante se enfoque en comprender la arquitectura y configuración en lugar de memorizar comandos repetitivos. 

33 

# **2.3.1 Pipelines** 

Un pipeline es una secuencia estructurada de etapas automatizadas que transforman código fuente en una aplicación desplegada. Generalmente incluye compilación, pruebas, construcción de imágenes y despliegue. 

Los pipelines garantizan consistencia y trazabilidad en el ciclo de vida del software, permitiendo identificar errores en etapas tempranas del proceso. 

# **2.3.2 CI/CD** 

CI/CD (Integración Continua y Entrega/Despliegue Continuo) es una práctica que automatiza la integración de cambios de código y su posterior despliegue. La integración continua verifica que nuevas modificaciones no rompan el sistema, mientras que la entrega continua permite desplegar versiones funcionales de forma frecuente. 

Este enfoque reduce tiempos de entrega y mejora la calidad del software, siendo un pilar en metodologías ágiles. 

# **2.3.3 Acciones de GitHub** 

GitHub Actions, nombre en inglés, es una herramienta de automatización integrada en GitHub que permite definir flujos de trabajo para ejecutar pipelines de CI/CD. Mediante archivos YAML, los desarrolladores configuran tareas automáticas ante eventos como commits o pull requests. 

Su integración con repositorios facilita la automatización del ciclo de vida del software sin necesidad de infraestructura adicional. 

# **2.3.4 Idempotencia** 

La idempotencia es una propiedad de ciertos procesos u operaciones mediante la cual una acción puede ejecutarse múltiples veces sin alterar el resultado final después de la primera ejecución exitosa. 

34 

En el contexto de sistemas automatizados e infraestructura gestionada mediante código, la idempotencia es un principio fundamental, ya que garantiza que la ejecución repetida de un mismo conjunto de instrucciones produzca siempre el mismo estado del sistema. 

Este principio es ampliamente utilizado en herramientas de automatización, configuración de servidores y despliegue de infraestructura, donde las operaciones deben ser confiables y reproducibles incluso cuando se ejecutan de forma repetida o ante fallos parciales del sistema. 

Comprender la idempotencia permite diseñar procesos automatizados más robustos, reduciendo inconsistencias en la configuración de sistemas y facilitando la recuperación ante errores. 

# **2.4 Monitoreo** 

El monitoreo es el proceso continuo de observación, medición y análisis del comportamiento de sistemas y servicios en ejecución. Su objetivo principal es garantizar que los recursos tecnológicos operen dentro de parámetros aceptables de rendimiento, disponibilidad y estabilidad. En entornos contenedorizados, el monitoreo permite supervisar el consumo de CPU, memoria, almacenamiento y tráfico de red, así como detectar fallos o comportamientos anómalos. 

Desde una perspectiva educativa, el monitoreo constituye una herramienta clave para que el estudiante comprenda la relación entre configuración y rendimiento. Observar métricas en tiempo real facilita la comprensión del impacto que tiene la asignación de recursos en la estabilidad y desempeño de los servicios desplegados. 

# **2.4.1 Estado de servicios** 

El estado de un servicio hace referencia a su condición operativa en un momento determinado, pudiendo encontrarse en ejecución, detenido, en reinicio o en error. La supervisión del estado permite verificar que los procesos asociados a un contenedor o aplicación estén funcionando correctamente y cumpliendo su propósito. 

35 

En sistemas automatizados, la verificación constante del estado es esencial para mantener la disponibilidad del servicio. En un contexto formativo, visualizar estos estados ayuda al estudiante a identificar fallos y comprender el ciclo de vida de una aplicación desplegada. 

# **2.4.2 Alertas** 

Las alertas son mecanismos de notificación que se activan cuando un sistema detecta condiciones que exceden umbrales previamente definidos, como consumo elevado de memoria, fallos de conexión o interrupciones del servicio. Estas pueden presentarse mediante mensajes visuales, registros o notificaciones electrónicas. 

El uso de alertas permite una gestión proactiva de la infraestructura, reduciendo tiempos de respuesta ante incidentes. En el ámbito educativo, facilitan la comprensión de prácticas preventivas y la importancia de la supervisión constante en entornos productivos. 

# **2.4.3 Acciones automáticas** 

Las acciones automáticas son respuestas preconfiguradas que se ejecutan de manera autónoma ante eventos específicos detectados por el sistema. Ejemplos de estas acciones incluyen el reinicio de un servicio que ha fallado o la limitación de recursos ante un consumo excesivo. 

Este mecanismo incrementa la resiliencia del sistema al reducir la dependencia de intervención manual inmediata. Desde el punto de vista formativo, permite demostrar cómo la automatización puede mejorar la estabilidad y eficiencia operativa en entornos tecnológicos. 

# **2.4.4 Observabilidad** 

La observabilidad es un concepto relacionado con la capacidad de comprender el estado interno de un sistema a partir del análisis de los datos que este genera durante su funcionamiento. Estos datos suelen incluir métricas, registros de eventos y trazas de ejecución. 

Un sistema observable permite identificar fallos, analizar el comportamiento de los servicios y comprender cómo interactúan los distintos componentes dentro de una arquitectura distribuida. 

36 

A diferencia del monitoreo tradicional, que se centra en la supervisión de indicadores específicos previamente definidos, la observabilidad busca proporcionar suficiente información para diagnosticar problemas inesperados o comportamientos emergentes dentro del sistema. 

En el contexto de plataformas basadas en contenedores y arquitecturas de microservicios, la observabilidad se convierte en un elemento esencial para garantizar la confiabilidad y el mantenimiento eficiente de los servicios. 

# **2.5 Interfaz** 

La interfaz es el medio a través del cual el usuario interactúa con el sistema, ya sea mediante elementos gráficos, formularios o visualizaciones dinámicas. Su diseño influye directamente en la experiencia de uso y en la facilidad con la que se comprenden procesos técnicos complejos. 

Una interfaz bien estructurada reduce la carga cognitiva y mejora la accesibilidad del sistema, especialmente cuando está orientada a usuarios en proceso de aprendizaje. En este proyecto, la interfaz cumple un rol pedagógico además de operativo. 

# **2.5.1 Aprendizaje visual** 

El aprendizaje visual se basa en la representación gráfica de información para facilitar la comprensión de conceptos abstractos. Diagramas, indicadores de estado y métricas en tiempo real permiten que el usuario asocie visualmente acciones con resultados. 

En el contexto de contenedores y despliegue automatizado, la visualización de recursos y estados facilita la internalización de conceptos como consumo de memoria, asignación de CPU y ciclo de vida de servicios. 

# **2.5.2 Interacción simple** 

La interacción simple consiste en diseñar mecanismos de uso intuitivos que minimicen la complejidad operativa. Esto se logra mediante formularios guiados, validaciones automáticas y flujos de trabajo estructurados que orientan al usuario paso a paso. 

37 

Reducir la complejidad no implica eliminar la profundidad técnica, sino presentar la información de manera progresiva. Este enfoque es especialmente relevante en entornos educativos donde el objetivo es facilitar la comprensión inicial. 

# **2.5.3 Prevención de errores** 

La prevención de errores es un principio de diseño que busca anticipar configuraciones incorrectas antes de que generen fallos en el sistema. Esto se implementa mediante validaciones de datos, restricciones de parámetros y confirmaciones previas a la ejecución de acciones críticas. 

En el ámbito educativo, la prevención de errores no solo evita fallos técnicos, sino que también actúa como mecanismo de retroalimentación inmediata, reforzando el aprendizaje correcto de buenas prácticas. 

# **2.6 Aprendizaje** 

El aprendizaje en entornos tecnológicos implica la adquisición progresiva de conocimientos teóricos y habilidades prácticas mediante la experimentación controlada. La combinación de teoría y práctica permite consolidar competencias técnicas aplicables en escenarios reales. 

En el contexto de este proyecto, el aprendizaje se fundamenta en la interacción directa con la infraestructura, permitiendo que el estudiante relacione conceptos abstractos con resultados observables. 

# **2.6.1 Ruta de aprendizaje** 

La ruta de aprendizaje es la secuencia estructurada de contenidos y actividades que guía al estudiante desde conceptos básicos hasta aplicaciones más complejas. Esta progresión ordenada facilita la construcción gradual del conocimiento. 

Diseñar una ruta clara evita la sobrecarga cognitiva y permite evaluar avances en cada etapa, asegurando que los fundamentos estén consolidados antes de avanzar a niveles superiores. 

38 

# **2.6.2 Módulos** 

Los módulos son unidades temáticas independientes que organizan el contenido en segmentos estructurados. Cada módulo aborda un conjunto específico de competencias o conceptos, permitiendo una evaluación parcial y progresiva. 

Esta división facilita la planificación didáctica y la adaptación del contenido a distintos niveles de complejidad dentro del programa académico. 

# **2.6.3 Material didáctico** 

El material didáctico comprende los recursos utilizados para apoyar el proceso de enseñanza-aprendizaje, tales como guías prácticas, documentación técnica, ejemplos y recursos visuales. Su diseño debe ser coherente con los objetivos formativos establecidos. 

En un entorno tecnológico, el material didáctico debe combinar claridad conceptual con aplicabilidad práctica, promoviendo tanto la comprensión teórica como la experimentación. 

# **2.6.4 Carga cognitiva** 

La teoría de la carga cognitiva se refiere a la cantidad de esfuerzo mental que una persona debe utilizar para procesar información durante una actividad de aprendizaje. Esta teoría sostiene que la capacidad de procesamiento de la memoria de trabajo es limitada, por lo que un exceso de información o complejidad puede dificultar la comprensión de nuevos conceptos. 

En el diseño de herramientas educativas, es importante considerar la carga cognitiva para evitar que los estudiantes se enfrenten a procesos innecesariamente complejos que puedan obstaculizar el aprendizaje. 

En el contexto de plataformas tecnológicas para la enseñanza, el uso de interfaces gráficas, procesos guiados y validaciones automáticas puede contribuir a reducir la carga cognitiva inicial, permitiendo que los estudiantes se concentren en comprender los conceptos fundamentales en lugar de enfrentarse a dificultades técnicas excesivas. 

39 

# **2.6.5 Aprendizaje Basado en la Experimentación** 

El aprendizaje basado en la experimentación es un enfoque pedagógico que promueve la adquisición de conocimientos a través de la interacción directa con situaciones prácticas o experimentales. Este modelo se basa en la idea de que los estudiantes comprenden mejor los conceptos cuando tienen la oportunidad de aplicarlos y observar sus resultados en un entorno controlado. 

Este enfoque se utiliza ampliamente en áreas técnicas y científicas, donde la práctica y la experimentación permiten desarrollar habilidades relacionadas con la resolución de problemas, la exploración de sistemas y la comprensión de procesos complejos. 

En el ámbito de la enseñanza de tecnologías informáticas, las plataformas que permiten realizar despliegues, pruebas y configuraciones reales constituyen herramientas valiosas para facilitar este tipo de aprendizaje. 

# **2.6.6 Andamiaje (Scaffolding)** 

El andamiaje es un concepto pedagógico que describe el proceso mediante el cual un sistema educativo proporciona apoyo temporal a los estudiantes durante el aprendizaje de nuevas habilidades o conocimientos. Este apoyo se presenta en forma de guías, instrucciones estructuradas, ejemplos o herramientas que facilitan la comprensión de tareas complejas. 

A medida que el estudiante desarrolla mayor dominio sobre el tema, estos apoyos pueden reducirse progresivamente, permitiendo que la persona realice las tareas de manera autónoma. 

En el diseño de plataformas educativas tecnológicas, el andamiaje puede implementarse mediante interfaces guiadas, validaciones automáticas, documentación integrada o asistentes interactivos que acompañen al usuario durante el proceso de aprendizaje. 

Este enfoque resulta especialmente útil en áreas técnicas donde los estudiantes pueden sentirse inicialmente abrumados por la complejidad de las herramientas o los conceptos involucrados. 

40 

# **2.6.7 Entornos de aprendizaje virtuales (Learning Platforms)** 

Los entornos de aprendizaje virtuales, también conocidos como plataformas educativas digitales o Learning Platforms, son sistemas informáticos diseñados para facilitar procesos de enseñanza y aprendizaje mediante la integración de recursos tecnológicos interactivos. Estas plataformas permiten la distribución de contenidos educativos, la realización de actividades prácticas, la evaluación del desempeño académico y la comunicación entre estudiantes y docentes dentro de un espacio digital estructurado. 

En el contexto de la educación tecnológica, los entornos de aprendizaje virtuales adquieren especial relevancia al permitir la simulación de escenarios reales de trabajo mediante herramientas interactivas que favorecen el aprendizaje activo. A diferencia de los sistemas tradicionales centrados únicamente en la entrega de contenido teórico, las plataformas modernas incorporan funcionalidades como monitoreo del progreso, retroalimentación automática y experimentación guiada, lo cual facilita la comprensión de conceptos complejos y promueve el desarrollo de competencias prácticas en áreas como infraestructura tecnológica, automatización y administración de servicios informáticos. 

# **2.7 Evaluación** 

La evaluación es el proceso mediante el cual se mide el grado de adquisición de conocimientos y habilidades por parte del estudiante. Permite determinar la efectividad de la metodología empleada y validar el cumplimiento de los objetivos formativos. 

En proyectos de carácter experimental, la evaluación también sirve como instrumento para comparar metodologías tradicionales frente a nuevas herramientas educativas. 

# **2.7.1 Actividades de aprendizaje** 

Las actividades de aprendizaje son ejercicios prácticos diseñados para aplicar los conceptos estudiados en situaciones concretas. Estas pueden incluir la creación de contenedores, configuración de recursos o análisis de métricas. 

Mediante estas actividades se fomenta el aprendizaje activo, permitiendo que el estudiante consolide conocimientos a través de la práctica directa. 

41 

# **2.7.2 Exámenes** 

Los exámenes son instrumentos formales de medición que permiten evaluar conocimientos teóricos y competencias prácticas adquiridas. Pueden estructurarse en formato escrito, práctico o mixto, según los objetivos del curso. 

Su aplicación sistemática permite comparar resultados entre distintos grupos experimentales, aportando evidencia cuantitativa sobre la efectividad de la herramienta propuesta. 

# **2.7.3 Evaluación práctica** 

La evaluación práctica es un proceso de medición del aprendizaje orientado a verificar la capacidad del estudiante para aplicar conocimientos teóricos en la resolución de problemas reales o simulados dentro de un entorno controlado. Este tipo de evaluación se fundamenta en la observación del desempeño del estudiante durante la ejecución de tareas específicas, permitiendo valorar habilidades técnicas, toma de decisiones y comprensión operativa de los conceptos estudiados. 

En áreas relacionadas con la ingeniería en sistemas y la administración de infraestructura tecnológica, la evaluación práctica constituye un elemento esencial del proceso formativo, ya que permite determinar el nivel de dominio alcanzado en el uso de herramientas, la configuración de servicios y la implementación de soluciones automatizadas. En el marco del presente proyecto, la evaluación práctica se integra como un mecanismo para medir el impacto de la plataforma educativa propuesta en la mejora de la comprensión de tecnologías de contenedorización y despliegue automatizado, mediante la comparación del desempeño de los estudiantes antes y después de su utilización. 

42 

# **CAPÍTULO III** 

# **MARCO METODOLOGICO** 

En este capítulo se hace el desglose de la metodología a utilizar para la investigación referente a este proyecto. La investigación tendrá un enfoque experimental y comparativo orientado a entender el nivel de dificultad actual de aprendizaje con los medios tradicionales en el tema de despliegue automatizado de servicios y contenedorización. 

# **3.1 Diseño de la investigación** 

El presente estudio adopta un diseño cuasiexperimental con enfoque comparativo, orientado a evaluar el impacto del uso de una plataforma educativa de orquestación y despliegue automatizado de servicios sobre el desempeño práctico de estudiantes en tareas relacionadas con la contenedorización de aplicaciones. El diseño contempla la conformación de dos grupos. Grupo experimental que utilizará la plataforma desarrollada y grupo control que realizará las tareas mediante herramientas tradicionales basadas en línea de comandos. 

# **3.2 Enfoque de la investigación** 

El estudio se desarrolla bajo un enfoque cuantitativo con apoyo cualitativo complementario. El enfoque cuantitativo permitirá: medir tiempos de despliegue, evaluar desempeño práctico, comparar resultados entre grupos y validar la hipótesis planteada. El enfoque cualitativo complementario permitirá: analizar percepción de uso, evaluar experiencia del estudiante, identificar dificultades durante la interacción con la plataforma. Por tanto, la investigación presenta un enfoque mixto con predominio cuantitativo. 

# **3.3 Población** 

La población objeto de estudio está conformada por estudiantes universitarios del área de Ingeniería en Sistemas o carreras afines que posean conocimientos básicos relacionados con: sistemas operativos Linux, contenedores Docker, ejecución de comandos en terminal. Estos estudiantes constituyen el grupo objetivo natural de la plataforma educativa propuesta. 

43 

# **3.4 Muestra y muestreo** 

Dado la cantidad promedio de estudiantes por aula en los cursos intermedios a avanzados en la universidad Mariano Galvez, Campus Villa Nueva, que ronda en 25 estudiantes aproximadamente, con un total aproximado de 4 secciones por curso, se estima un total de 100 estudiantes como el total de la población que califica entre los parámetros previamente definidos. 

# **Figura 3** 

Fórmula para calcular el tamaño de la muestra en poblaciones infinitas. 



_Nota_ . Fórmula para calcular el tamaño de la muestra, por Software para encuestas SurveyMonkey, 2026. (https://es.surveymonkey.com/mp/sample-size-calculator ) 

En donde, las variables de la figura 3 significan: 

- a. z = valor correspondiente al nivel de confianza deseado. 

- b. p = proporción estimada de la población que posee características de interés. 

- c. e = margen de error deseado. 

- d. N = tamaño de la población. 

Por lo previamente mencionado, el tamaño de la población estimado es de 100 alumnos que cumplen con los requisitos mínimos para el estudio y aplicando un nivel de confianza de 85% con un margen de error del 10%, el tamaño de la muestra será de 35 alumnos. 

# **3.5 Técnicas de recolección de datos** 

Para la recolección de datos se realizarán pruebas practicas controladas y encuestas estructuradas. La prueba practica consistirá en la ejecución de tareas de despliegue previamente definidas. Esto permitirá medir eficiencia, precisión y autonomía operativa. La 

44 

encuesta estructurada permitirá evaluar la percepción de facilidad de uso, experiencia del usuario y compresión de proceso de despliegue. 

# **3.6 Instrumentos de recolección de datos** 

Los instrumentos utilizados serán guías de observación, lista de verificación y cuestionarios. La guía de observación registrará tiempo de ejecución, número de errores, finalización correcta del proceso e intervención requerida. La lista de verificación permitirá validar la ejecución correcta de comandos, despliegue exitoso del servicio y verificación del estado del contenedor. El cuestionario será la pieza clave que nos permitirá evaluar la facilidad de uso percibida, comprensión del proceso, nivel de satisfacción y utilidad educativa de la plataforma. Estos se realizarán con la herramienta de Google forms. 

# **3.7 Técnicas de procesamiento de datos** 

Los datos recolectados serán procesados mediante técnicas estadísticas descriptivas y comparativas. Se aplicarán: cálculo de promedios, análisis porcentual, comparación de medias, tablas comparativas y gráficos de resultados. Estos procedimientos permitirán evaluar diferencias entre el grupo control y grupo experimental. 

# **3.8 Herramientas para el procesamiento de datos** 

El procesamiento de los datos se realizará utilizando herramientas integradas en la plataforma de Google Forms, así como otras complementarias que pueden ser Excel o Power BI. Estas herramientas permitirán organizar, clasificar y analizar la información obtenida durante la fase experimental. 

# **3.9 Nivel de confianza** 

El estudio se hará con un nivel de confianza del 85%. Este nivel de confianza se ha elegido considerando la disponibilidad de estudiantes que cumplan con los requisitos mínimos, el tiempo disponible para la evaluación y la viabilidad del estudio. Un nivel de confianza más alto requeriría de un personal más grande y un tamaño muestra mucho más grande. 

45 

# **3.10 Hipótesis** 

La implementación de una plataforma educativa para la orquestación y despliegue automatizado de servicios en servidores físicos reduce al menos un 20% el tiempo promedio de despliegue y mejora al menos un 15% el desempeño práctico de los estudiantes en comparación con el uso exclusivo de herramientas basadas en línea de comandos. 

# **3.11 Variable de estudio** 

Las variables de interés en el presente estudio son las guías medibles utilizadas para discernir la utilidad práctica de la herramienta pedagógica desarrollada. Estas variables buscan estar alineadas con los indicadores de éxito del presente trabajo. 

# **3.11.1 Variable independiente** 

Para el presente estudio, está variable será: Uso de la plataforma educativa de orquestación y despliegue automatizado de servicios. Está variable tiene por dimensiones la interfaz gráfica educativa, automatización del despliegue, visualización del estado de servicios y monitoreo básico de recursos. 

# **3.11.2 Variable dependiente** 

Para el presente estudio, la variable dependiente será el desempeño práctico y comprensión conceptual del estudiante en el proceso de despliegue automatizado de servicios contenedorizados. Esta variable permite medir el impacto educativo de la plataforma propuesta mediante indicadores observables durante la ejecución de tareas prácticas y evaluaciones de comprensión técnica. Las dimensiones de esta variable se encuentran alineadas con los indicadores de éxito definidos para el proyecto: reducción del tiempo de despliegue, mejora en la comprensión conceptual, disminución de errores de configuración. 

# **3.11.3 Operacionalidad de las variables** 

La operacionalidad de las variables en este proyecto se enfoca en medir aspectos clave relacionados con el aprendizaje del despliegue automatizado de servicios y la contenedorización de los mismos. Se evaluará la asimilación de conceptos clave en los 

46 

estudiantes como Docker, contenedores, pods, servicios, monitoreo y más. La efectividad educativa de la herramienta se medirá en base a las respuestas de las encuestas cualitativas llenadas por los estudiantes luego de utilizar la herramienta desarrollada. 

# **3.11.4 Organizador gráfico** 

En la siguiente figura se muestra lo anteriormente expuesto, pero de forma gráfica a modo de resumen visual. Esto con el fin de concatenar todas las ideas y supuestos de la investigación creando un medio ilustrativo que condensé la metodología seguida en esta investigación. 

# **Figura 4** 

Organizador grafico 

47 



<!-- Start of picture text -->
Plataforma.  educativas  para<br>gestidn DevOps<br>Problema Hipotesis<br>Los estudiantes y profesionales El dexesrolio ¢ lmplermentaciin deenn,<br>en el mbito<br>menudo enfrentande el DevOps desafio a  de arinpara el esplicqueieclthen ydo de fac sistemas oequectantn pucde<br>educacidn automatizadacomplejosaepact conceptospeorimtork de Pinarre beesrsraaorssy delosaeficdenc ms<br>curvaservicios de aprendizaje en servidores empinada; conunaa Sebrsjapedenenbaarrdsepealcomprension,nite tea el is¥etsea<br>profundizan en los recursos aprendizaje, ademas “7 ta e  H al<br>demas formacién.recientes Ladurantegestionla etapa de los greeprocesoonpracticeie areasyaumentarce detourla<br>errores no refleja los entornos Pscacimntid fopncesert =ne<br>‘ de produccion modernos. ‘ ecm<br>v<br>Objetivo General<br>Disenar e implementar una plataforma educativa integral que simplifique la<br>orquestacidn y el desplieque automatizado de servicios en servidores fisicos,<br>facilitando el aprendizaje practico de conceptos y herramientas DevOps mediante<br>una interfaz grafica inicial y potenciando la formacién técnica en esta area.<br>v Vv Vv<br>Objetivos Indicadores Impacto en la<br>Especificos de Exito Comunidad<br>( Ceserrvilares unsinterfae 1. Reducciéndet 1 Acceso Demacratizads<br>: 2.walepaceAstoreastioar edectadoeoot aisterraaloe che dismninuirpromedtiorequerdepara desplegarel tiempo un unaepeeen laherramienta educacion. gratuitanied<br>;: hbbe eowere-chemeareineer brates trabajomas, especiaimenteenun 10% 0 2 FortalecimientohabJidadea: Mejorarde lal s a<br>carpees eta da para tiempos largos Jonsh alge ej0.de<br>bere rm (50% omas). oteaieasomonaiek<br>A. Marieneraprandizajsus (e.g, sivterme de 7.Practicadeincorporacion y alone ral ae<br>Peover renin formacién técnica seposumees?<br>4.laberaterio Cree unantoenetecnico de leg. 3. Manteneravanzada(2una meses). 4 ‘1. FomentarCofaboracién:la innowmeién y<br>iouadeapucat puntuacién en SentraCrear una<br>bomtenoretiain wtecter een pruebas: mejorarlas de aprendizajecolon para presuacs que<br>Seyneurees rerrarornsi pevtoraro a<br>S.Edueurydecementacan formar: tulorisies inectuie medicionserch y mejores prictieasalat ”<br>" [resortercseslasperarrengewlaprendizejecrcaohaselamasiainpara loneaasecacsapberesetbys 7 &.tras Positiveplataforma.ofrecerresultadossatisfaccian eluso unadel de la DevOps alta usuario: en ; 4. ContrbuldalsaettnaPotencialpermitiLieecinerraphoae Ccigo Abierto: p aaraeparineee Creeimiema liberar el¥<br>7.Adopeianpetpropreshreriseusp.peelplatulorma:crecimiento= deeperdanrtty y umetaterrea. depromever usuaricnde ba Lake: 3 Leoraencuestasaprendizajetrasemas el uso dedede DevOpseons Is | & MaderamacioncomuridadbrssnsccRenimuseducacion:models paranee MRSC:educatServir futurasLatherdelacomobeg<br>plataforma. | Hite wasteeducativa de<br>| excelencia en campos<br><!-- End of picture text -->

# **3.12 Supuestos** 

Para el desarrollo del presente estudio se consideran los siguientes supuestos metodológicos, estructurados mediante un análisis FODA (Fortalezas, Oportunidades, Debilidades y Amenazas), el cual permite identificar factores internos y externos que pueden influir en la ejecución del proyecto y en la validez de sus resultados 

# **3.12.1 Fortalezas** 

- a) Existencia de una arquitectura tecnológica definida basada en herramientas ampliamente utilizadas en entornos reales (Docker, Node.js, PostgreSQL y React). 

- b) Disponibilidad de un entorno experimental controlado dentro del contexto académico. 

- c) Diseño de una plataforma educativa orientada específicamente al aprendizaje guiado del despliegue automatizado de servicios. 

- d) Integración de validación práctica mediante comparación entre grupo experimental y grupo control. 

- e) Alineación del proyecto con tendencias actuales en formación DevOps dentro de la ingeniería de software. 

# **3.12.2 Oportunidades** 

- a) Creciente demanda de competencias en contenedorización y despliegue automatizado en el ámbito profesional. 

- b) Escasa disponibilidad de plataformas educativas enfocadas específicamente en aprendizaje guiado de orquestación de servicios en servidores físicos. 

- c) Posibilidad de reutilización futura de la plataforma como herramienta institucional de apoyo docente. 

- d) Potencial incorporación del sistema en cursos de sistemas operativos, redes o ingeniería de software. 

# **3.12.3 Debilidades** 

- a) Tamaño de muestra limitado debido a disponibilidad de estudiantes con conocimientos previos básicos requeridos. 

49 

- b) Restricciones de infraestructura física para pruebas simultáneas de despliegue. 

- c) Desarrollo realizado por un único investigador, lo que limita la velocidad de implementación. 

- d) Dependencia parcial de conectividad y recursos disponibles en el entorno de pruebas. 

# **3.12.4 Amenazas** 

- a) Diferencias en el nivel previo de conocimiento técnico entre participantes. 

- b) Disponibilidad variable de los estudiantes durante la fase experimental. 

- c) Posibles cambios en la infraestructura institucional utilizada para la validación. 

- d) Limitaciones de tiempo propias del calendario académico para ejecución completa del experimento. 

# **3.13 Delimitación del estudio** 

El presente estudio se delimita al diseño, implementación y evaluación experimental de una plataforma educativa orientada al aprendizaje del despliegue automatizado de servicios contenedorizados en servidores físicos dentro de un contexto universitario. 

La investigación se centra específicamente en: 

- estudiantes universitarios del área de Ingeniería en Sistemas o carreras afines 

- tareas básicas de despliegue automatizado mediante contenedores Docker 

- comparación entre uso de interfaz gráfica educativa y uso de línea de comandos 

- medición de tiempo de despliegue, comprensión conceptual y errores de configuración 

El estudio no contempla: 

- implementación en entornos empresariales productivos 

- evaluación de alta disponibilidad o tolerancia a fallos 

- despliegues distribuidos complejos tipo Kubernetes multinodo 

- evaluación de rendimiento a nivel infraestructura industrial 

Estas delimitaciones permiten mantener coherencia con el carácter educativo y experimental del proyecto. 

50 

# **3.14 Limitaciones del estudio** 

Durante la ejecución del presente estudio pueden presentarse limitaciones propias del contexto académico y tecnológico en el cual se desarrolla la investigación. 

Entre las principales limitaciones se identifican: 

- disponibilidad restringida de estudiantes con conocimientos previos mínimos en contenedorización 

- tamaño reducido de muestra debido al carácter experimental del estudio 

- limitaciones de recursos de hardware disponibles para pruebas simultáneas 

- variabilidad en el nivel de experiencia técnica entre participantes 

- tiempo disponible para ejecución de pruebas dentro del calendario académico 

No obstante, estas limitaciones no afectan la validez del estudio, debido a que el diseño cuasiexperimental permite realizar comparaciones controladas dentro del entorno definido. 

# **3.15 Alcances metodológicos** 

El alcance metodológico del presente estudio corresponde a una investigación aplicada con validación experimental orientada a evaluar el impacto educativo de una plataforma tecnológica desarrollada con fines pedagógicos. 

El estudio permitirá: 

- medir el tiempo promedio de despliegue de servicios contenedorizados 

- evaluar el nivel de comprensión conceptual de los estudiantes 

- identificar errores comunes durante procesos manuales de despliegue 

- comparar resultados entre interacción mediante interfaz gráfica y línea de comandos 

- analizar la percepción de facilidad de uso de la plataforma educativa 

Los resultados obtenidos permitirán establecer evidencia cuantitativa sobre la utilidad de herramientas educativas basadas en contenedorización dentro del proceso de formación en ingeniería en sistemas. 

51 

# **3.16 Técnicas de investigación** 

Para el desarrollo del presente estudio se emplearán diversas técnicas de investigación que permitirán recolectar información cuantitativa y cualitativa necesaria para la validación de la hipótesis planteada. 

Las técnicas seleccionadas responden a la naturaleza experimental del proyecto y al enfoque educativo de la plataforma desarrollada. 

# **3.16.1 Observación** 

La técnica de observación será utilizada durante la ejecución de las pruebas prácticas controladas con los estudiantes participantes. 

Esta técnica permitirá registrar: 

- tiempo requerido para completar tareas de despliegue 

- número de errores cometidos durante el proceso 

- secuencia de acciones realizadas por los participantes 

- nivel de asistencia requerida durante la actividad 

La observación será estructurada mediante guías previamente definidas, lo que permitirá garantizar uniformidad en la recolección de datos. 

# **3.16.2 Investigación documental** 

La investigación documental será utilizada para fundamentar teóricamente el desarrollo del proyecto mediante la revisión de: 

- literatura científica sobre contenedorización 

- estudios relacionados con aprendizaje asistido por herramientas tecnológicas 

- documentación técnica de plataformas de despliegue automatizado 

- investigaciones previas sobre enseñanza de tecnologías DevOps 

Esta técnica permitió construir el marco teórico del estudio y respaldar el diseño metodológico propuesto. 

52 

# **3.16.3 Estudio de caso** 

El presente proyecto incorpora un estudio de caso aplicado dentro de un entorno educativo universitario, en el cual se evaluará el impacto del uso de la plataforma desarrollada sobre el desempeño práctico de los estudiantes. 

El estudio de caso permitirá: 

- analizar el comportamiento de los participantes durante la interacción con la plataforma 

- comparar resultados frente al uso de herramientas tradicionales 

- identificar mejoras en comprensión conceptual 

- validar la utilidad pedagógica del sistema propuesto 

Este enfoque fortalece la validez aplicada del estudio al situarlo dentro de un contexto real de aprendizaje. 

# **3.17 Análisis de datos** 

Se analiza el resultado de la encuesta aplicada a 38 personas, estudiantes de último año de ingeniería de software y profesionales del área graduados que actualmente ejercen en alguna área relacionada a sistemas informáticos. 

# **Figura 5** 

Resultados de la encuesta 

53 



<!-- Start of picture text -->
~Cual es su grado academico? ~Como considera las herramientas actuales para el<br>aprendizaje sobre el uso de contenedores?<br>Nada eficientes<br>Graduadode nivel li . . 87%<br>Muy eficientes<br>Estudiante universita... Poco26,79 eficientes =<br>Maestra<br>26,79 E<br>33,3%<br>&éCémo considera las herramientas actuales para el<br>aprendizaje sobre despliegues automaticos?<br>Nada eticientes ¢Conoce alguna de las siguientes herramientas o plataformas de aprendizaje sobre devops?<br>57% Muy eficientes Marque todas las que conozca.<br>GitHub Learn 8 (53,3 %)<br>Poco567 éficientes Cloudshare| 3 (20 %)<br>Kodekloud 5 (33.3%)<br>PluralSight|—0 (0 %)<br>LIFT - Linux foundation training} 2 (13,3 %)<br>No conozco ninguna de las ant... § (33,3%)<br>CloudGuru 1 (6,7 %)<br>Eficientes46,7 i) 2 4 6 8<br>Cree que es necesaria la implementacion de una plataforma educativa<br>que exponga de forma grafica y guiada los procesos de creacién de<br>éConsidera de utilidad una plataforma educativa con interfaz contenedores, despliegues, monitorizacién y otras tareas relacionadas a<br>grafica como fase previa al aprendizaje del uso de una las actividades de un DevOps?<br>consola de comandos? Tal vez<br>Tal vez<br>200%<br>Si<br>80.0%<br>Si usted ya domina al menos los conceptos basicos de ae<br>DevOps, {Como cree que hubiera sido su aprendizaje al<br>tener el sistema propuesto en los inicios de su aprendizaje?<br>{Cree usted que se formarian mejores profesionales DevOps<br>si hace uso de la herramienta propuesta?<br>Facil al inicio<br>33<br>Tal26,7%vez<br>Mas faci.<br>si<br><!-- End of picture text -->

_Nota_ . Resultado de la encuesta realizada a estudiantes de último año en ingeniería de sistemas de la universidad Mariano Galvez de Guatemala y profesionales de ingeniería de software que laboran en Banco Industrial. Fuente propia. 

# **3.17.1 Análisis de resultados de cuestionario inicial** 

Los resultados obtenidos demuestran que existe una brecha técnica y pedagógica en la enseñanza actual de las metodologías DevOps. La alta percepción de dificultad, sumada a la preferencia por herramientas gráficas centralizadas, confirma que el proyecto no solo es viable desde una perspectiva técnica, sino que es necesario y demandado por el público objetivo para optimizar los procesos de formación académica y profesional en la ingeniería de software. 

Un hallazgo crítico reside en la percepción del aprendizaje de herramientas de orquestación y despliegue. El 60% de los encuestados califica como "Difícil" el proceso de aprendizaje de estas tecnologías, mientras que un 20% lo considera "Muy difícil". Esta cifra acumulada del 80% evidencia una barrera de entrada significativa, validando la necesidad de una herramienta que simplifique la curva de aprendizaje mediante una interfaz intuitiva. 

En cuanto a la eficiencia operativa, la encuesta revela que el 80% de los participantes considera que la centralización de herramientas en un solo lugar facilitaría "Mucho" el aprendizaje de DevOps. Este dato respalda directamente la arquitectura propuesta para la plataforma, la cual busca reducir la dispersión cognitiva al integrar diversas funcionalidades en un ecosistema unificado. 

A pesar de la naturaleza técnica de la disciplina, existe una clara preferencia por las interfaces visuales para fines educativos: 80% de los consultados prefiere una Interfaz Gráfica (GUI) para aprender los conceptos de DevOps. Únicamente el 20% se inclina por el uso exclusivo de la línea de comandos (CLI). Este resultado justifica el desarrollo del frontend de la plataforma como un facilitador didáctico que no reemplaza la lógica técnica, sino que la hace accesible. 

Finalmente, la intención de adopción es sumamente alta. El 100% de la muestra (sumando un 80% de "Definitivamente sí" y un 20% de "Probablemente sí") manifestó su disposición a 

55 

utilizar una plataforma que simplifique la gestión de contenedores y el despliegue de aplicaciones. 

# **3.18 Análisis de factibilidad** 

El análisis de factibilidad permite evaluar la viabilidad del proyecto desde distintas perspectivas, determinando si su implementación es posible considerando los recursos técnicos, económicos, operativos y legales disponibles. En el presente estudio, se analiza la viabilidad de la plataforma educativa para la gestión y despliegue automatizado de servicios en servidores físicos dentro de un entorno académico controlado. 

# **3.18.1 Factibilidad técnica** 

La factibilidad técnica evalúa la disponibilidad y adecuación de los recursos tecnológicos necesarios para el desarrollo e implementación de la plataforma propuesta. Considerando la arquitectura definida en el proyecto, basada en tecnologías ampliamente adoptadas en el ámbito profesional, se determina que la viabilidad técnica es alta. 

El sistema propuesto se fundamenta en una arquitectura modular compuesta por un frontend desarrollado en React, un backend en Node.js encargado de ejecutar comandos Docker CLI, y una base de datos PostgreSQL para la gestión de la información. Esta combinación tecnológica es compatible con entornos académicos y no requiere infraestructura especializada de alto costo. 

Asimismo, el uso de contenedores Docker permite garantizar portabilidad, aislamiento de servicios y facilidad de despliegue, lo cual reduce la complejidad de instalación y mantenimiento del sistema. 

# **3.18.1.1 Características del hardware** 

Para la implementación del sistema se requiere infraestructura de cómputo de pequeña, en comparación a infraestructuras productivas, accesible dentro de un entorno académico o incluso mediante equipos personales. 

56 

Las características mínimas recomendadas para el servidor donde se desplegará la plataforma son las siguientes: 

- a) Procesador: 4 núcleos (Intel i5 / Ryzen 5 o equivalente) 

- b) Memoria RAM: 8 GB (mínimo), 16 GB recomendado 

- c) Almacenamiento: 256 GB SSD 

- d) Conectividad: red local estable 

Estas especificaciones permiten ejecutar simultáneamente múltiples contenedores, gestionar servicios y realizar monitoreo básico de recursos sin afectar el rendimiento del sistema. 

# **3.18.1.1 Características del software** 

El entorno de software requerido para el desarrollo e implementación del sistema está compuesto por herramientas de código abierto y ampliamente documentadas, lo que favorece su adopción y mantenimiento. 

Entre los principales componentes se encuentran: 

- a) Sistema operativo: Linux (recomendado Ubuntu Server o Debian) 

- b) Motor de contenedores: Docker 

- c) Lenguaje backend: Node.js 

- d) Framework frontend: React.js 

- e) Base de datos: PostgreSQL 

- f) Control de versiones: Git 

Adicionalmente, el sistema puede integrarse con herramientas complementarias para monitoreo básico o visualización de datos, sin requerir licencias propietarias. 

La elección de estas tecnologías garantiza compatibilidad, estabilidad y soporte comunitario, reduciendo riesgos técnicos durante el desarrollo. 

57 

# **3.18.2 Factibilidad económica** 

La factibilidad económica analiza los costos asociados al desarrollo e implementación del proyecto, determinando si estos son asumibles dentro del contexto del investigador. 

Debido a que el sistema se basa en tecnologías de código abierto y será desarrollado por un único investigador, los costos son significativamente reducidos, lo que incrementa la viabilidad del proyecto. 

# **3.18.2.1 Equipo para el proyecto** 

El equipo necesario para el desarrollo del sistema incluye: 

- a) Computadora personal del desarrollador 

- b) Servidor físico o equipo reutilizado para pruebas 

- c) Red local para conexión entre usuarios y servidor 

No se requiere adquisición de licencias de software, ya que todas las herramientas utilizadas son de libre distribución. 

En caso de no contar con servidor dedicado, el proyecto puede ejecutarse en una computadora personal con las especificaciones previamente descritas. 

# **3.18.2.2 Gastos totales** 

Los costos estimados del proyecto son bajos y se pueden clasificar de la siguiente manera: 

- a) Hardware: 

   - a. Uso de equipo existente (sin costo adicional) 

   - b. Opcional: adquisición de servidor básico (Q3,000 – Q6,000 aprox.) 

- b) Software: 

   - a. Sin costo (tecnologías open source) 

- c) Servicios: 

   - a. Energía eléctrica e internet (costos operativos ya existentes) 

d) Desarrollo: 

58 

- a. Se consideran aproximadamente 160 horas de trabajo en el desarrollo de la plataforma. El costo por hora laboral del encargado del desarrollo (mismo que desarrolla este documento) es en promedio de Q50.00. Por tanto, se estima que el costo de desarrollo es de Q8000.00 aproximadamente. 

En consecuencia, el costo total del proyecto se mantiene dentro de un rango accesible, lo cual confirma su viabilidad económica. 

# **3.18.3 Factibilidad operativa** 

La factibilidad operativa evalúa la capacidad del sistema para integrarse y funcionar dentro del entorno en el que será utilizado. 

En este caso, la plataforma está diseñada específicamente para un contexto educativo, lo cual representa una ventaja significativa, ya que: 

- a) Los usuarios objetivo (estudiantes) poseen conocimientos básicos de tecnología 

- b) El sistema simplifica procesos complejos mediante una interfaz gráfica 

- c) No requiere capacitación avanzada para su uso inicial 

Además, la plataforma se alinea con los objetivos curriculares del programa de Ingeniería en Sistemas, facilitando su adopción como herramienta de apoyo académico. 

El sistema también incorpora validaciones y guías que reducen errores de configuración, mejorando la experiencia del usuario y disminuyendo la dependencia de asistencia técnica constante. 

Por tanto, se concluye que la implementación del sistema es operativamente viable y coherente con el entorno donde será aplicado. 

# **3.18.4 Factibilidad legal** 

La factibilidad legal analiza el cumplimiento de normativas y regulaciones relacionadas con el uso de software, datos y recursos tecnológicos. 

El proyecto presenta un bajo riesgo legal debido a las siguientes razones: 

59 

- a) Uso de software de código abierto (Docker, Node.js, PostgreSQL, React), con licencias permisivas 

- b) No se maneja información sensible o datos personales críticos 

- c) El sistema se implementa en un entorno académico controlado 

Asimismo, al tratarse de una herramienta educativa, su uso se limita a fines formativos, lo cual reduce implicaciones legales asociadas a entornos productivos. 

60 

# **CAPITULO IV** 

# **FASE DE DISEÑO** 

La fase de diseño constituye la etapa en la cual los requerimientos identificados durante la investigación se transforman en especificaciones técnicas concretas que guiarán la construcción del prototipo funcional. En el contexto del presente proyecto, esta fase adquiere especial relevancia debido a la naturaleza dual de la plataforma: por un lado, debe responder a requisitos técnicos propios de un sistema de despliegue automatizado de servicios contenedorizados; por otro, debe satisfacer requisitos pedagógicos que garanticen su efectividad como herramienta educativa. 

# **4.1 Fase de diseño** 

El diseño se aborda desde una perspectiva de arquitectura por capas, modelo que permite separar responsabilidades de forma clara y favorecer la mantenibilidad del sistema. Este enfoque resulta particularmente adecuado para un proyecto académico, ya que facilita la trazabilidad entre los componentes lógicos del sistema y los conceptos teóricos abordados en los capítulos previos. 

A lo largo de esta sección se documentan los requerimientos funcionales y no funcionales del sistema, la arquitectura lógica propuesta, la identificación de clases que conforman el modelo del dominio, las especificaciones formales del software, los diagramas UML que describen el comportamiento dinámico del sistema, el modelo de datos y, finalmente, el diseño de las vistas que conforman la interfaz de usuario. El conjunto de estos elementos constituye el plano de construcción que orientará la fase de programación del prototipo. 

# **4.1.1 Requerimientos funcionales** 

Los requerimientos funcionales describen las capacidades operativas que el sistema debe ofrecer al usuario para cumplir con los objetivos planteados. En el caso de la plataforma educativa para gestión DevOps, estos requerimientos se derivan directamente de los objetivos específicos del proyecto y de las funcionalidades comprometidas en el alcance, articulándose alrededor de seis ejes principales: la gestión de usuarios y autenticación, la creación guiada de 

61 

servicios contenedorizados, la verificación previa de recursos del servidor, el despliegue automatizado, el monitoreo del estado y consumo, y el componente educativo y de evaluación. 

En relación con la gestión de usuarios, el sistema debe permitir el registro de cuentas para estudiantes y administradores docentes, así como la autenticación segura mediante credenciales validadas. La diferenciación de perfiles resulta necesaria para que los docentes puedan administrar módulos de aprendizaje y evaluaciones, mientras que los estudiantes interactúan con los servicios y completan las actividades formativas asignadas. 

En cuanto a la creación guiada de servicios contenedorizados, la plataforma debe ofrecer formularios estructurados que permitan al usuario definir los parámetros del servicio sin necesidad de redactar comandos manualmente. Estos formularios deben solicitar la imagen Docker a utilizar, los recursos asignados —CPU, memoria y almacenamiento—, los puertos a exponer, las variables de entorno y los volúmenes persistentes, aplicando validaciones automáticas sobre cada campo para prevenir errores de configuración. 

Antes de cualquier despliegue, el sistema debe ejecutar una verificación de recursos disponibles en el servidor físico, comparando la solicitud del usuario con la capacidad libre. Si los recursos solicitados exceden lo disponible, el despliegue debe rechazarse y el sistema debe informar al usuario el motivo específico del rechazo, indicando los recursos disponibles en ese momento. Esta verificación tiene un doble propósito: prevenir fallos en el servidor y reforzar pedagógicamente la noción de que toda asignación de recursos tiene un límite físico real. 

El despliegue automatizado debe ejecutarse a través de la interacción con Docker, generando los comandos correspondientes a partir de los parámetros del formulario validado. El sistema debe registrar cada despliegue en la base de datos, almacenando información sobre quién ejecutó la acción, cuándo se realizó, qué configuración se aplicó y cuál fue el resultado. Asimismo, el usuario debe poder detener, reiniciar y eliminar servicios desplegados desde la misma interfaz. 

El monitoreo del estado y consumo de servicios debe presentarse de forma visual y actualizada periódicamente, mostrando para cada servicio activo su estado de ejecución, su 

62 

consumo de CPU y memoria, y un histórico básico de eventos relevantes. Esta visualización constituye uno de los elementos pedagógicos centrales del proyecto, al permitir que el estudiante asocie cada acción ejecutada con su efecto observable en los recursos del servidor. 

Finalmente, el componente educativo y de evaluación debe permitir al docente definir módulos de aprendizaje compuestos por actividades prácticas, así como evaluaciones asociadas a cada módulo. El estudiante debe poder consultar su progreso en la ruta de aprendizaje, completar las actividades asignadas y recibir retroalimentación sobre su desempeño. El sistema debe registrar tiempos, errores y resultados para facilitar el análisis comparativo previsto en la fase experimental del proyecto. 

# **4.1.2 Requerimientos no funcionales** 

Los requerimientos no funcionales describen las cualidades que el sistema debe poseer para considerarse adecuado, más allá de las funciones específicas que ejecuta. Mientras que los requerimientos funcionales responden a la pregunta de qué debe hacer el sistema, los no funcionales responden a cómo debe hacerlo. En el contexto de la plataforma educativa para gestión DevOps, estos requerimientos cobran particular importancia debido a que el sistema interactúa directamente con recursos físicos del servidor y porque su efectividad pedagógica depende en gran medida de atributos como la facilidad de uso, la rapidez de respuesta y la claridad de la retroalimentación visual. 

Los requerimientos no funcionales de este proyecto se agrupan en siete categorías principales: usabilidad, rendimiento, seguridad, mantenibilidad, portabilidad, disponibilidad y escalabilidad. A continuación, se describe cada una de estas dimensiones. 

En cuanto a la usabilidad, la plataforma debe ofrecer una experiencia accesible para usuarios con conocimientos básicos en sistemas operativos Linux y contenedores, sin asumir familiaridad previa con la línea de comandos de Docker. Los formularios deben incluir textos de ayuda contextual, ejemplos de valores válidos y mensajes de error redactados en lenguaje claro que orienten al usuario sobre cómo corregir el problema. La interfaz debe seguir convenciones de diseño consistentes en todas sus vistas, con una curva de aprendizaje estimada que permita a un estudiante completar su primer despliegue en un tiempo significativamente 

63 

menor al requerido mediante línea de comandos. Este atributo es coherente con el indicador de éxito de reducción de al menos veinte por ciento en el tiempo promedio de despliegue establecido en el capítulo previo. 

En relación con el rendimiento, el sistema debe responder a las acciones del usuario en tiempos que no interfieran con la experiencia de aprendizaje. Las operaciones de consulta de estado de servicios deben completarse en menos de dos segundos bajo condiciones normales de carga. La verificación de recursos previa al despliegue debe ejecutarse en menos de tres segundos. El despliegue de un servicio contenedorizado debe completarse en un tiempo equivalente al requerido por la ejecución manual del comando Docker correspondiente, evitando que la capa de abstracción introduzca latencia perceptible. La actualización del panel de monitoreo debe ocurrir cada cinco segundos como mínimo, garantizando que el usuario perciba una visualización dinámica del estado de los servicios. 

La seguridad del sistema debe garantizar que únicamente usuarios autenticados puedan ejecutar acciones sobre el servidor. Las contraseñas deben almacenarse cifradas mediante algoritmos de resumen criptográfico actualizados, nunca en texto plano. La comunicación entre el cliente y el servidor debe realizarse sobre canales seguros mediante el protocolo HTTPS cuando el sistema se exponga fuera del entorno local. El sistema debe diferenciar permisos según el rol del usuario, impidiendo que un estudiante acceda a funciones administrativas reservadas al docente. Adicionalmente, los comandos ejecutados sobre Docker deben construirse mediante mecanismos que prevengan la inyección de instrucciones maliciosas, validando estrictamente los parámetros recibidos desde la interfaz antes de ser procesados por el backend. 

En cuanto a la mantenibilidad, el código fuente del proyecto debe estructurarse siguiendo el patrón de arquitectura por capas adoptado, separando claramente las responsabilidades de presentación, lógica de negocio, acceso a datos y persistencia. Cada módulo debe estar documentado mediante comentarios técnicos y archivos de referencia que faciliten su comprensión por parte de futuros colaboradores académicos. El proyecto debe utilizar control de versiones mediante Git, registrando el historial de cambios de forma trazable. La 

64 

nomenclatura de variables, funciones y componentes debe seguir convenciones consistentes que faciliten la lectura del código. 

La portabilidad del sistema constituye un atributo relevante dado el carácter académico del proyecto. La plataforma debe poder ejecutarse sobre cualquier servidor Linux con soporte para Docker, sin depender de configuraciones específicas del entorno institucional. Las dependencias del software deben gestionarse mediante archivos declarativos —package.json para Node.js, archivos de configuración de PostgreSQL y Dockerfiles para los componentes contenedorizables— que permitan reproducir el entorno de ejecución en máquinas distintas con esfuerzo mínimo. Esta característica facilita tanto la replicabilidad del experimento como la posibilidad de que otros estudiantes utilicen el prototipo en investigaciones posteriores. 

La disponibilidad esperada de la plataforma se enmarca en el contexto educativo del proyecto y no pretende alcanzar los niveles propios de un entorno productivo empresarial. El sistema debe estar disponible durante las sesiones de prueba programadas y durante las jornadas de evaluación experimental, sin que se contemplen mecanismos avanzados de tolerancia a fallos ni redundancia de servidores. En caso de interrupción del servicio, la recuperación debe poder completarse mediante el reinicio manual de los procesos en un tiempo razonable, sin pérdida de la información almacenada en la base de datos. 

Finalmente, la escalabilidad del prototipo se entiende dentro de los límites propios de su naturaleza educativa. El sistema debe soportar el uso concurrente de un grupo experimental de estudiantes, dimensionado conforme a la muestra definida en el marco metodológico, sin degradación apreciable del rendimiento. No se contempla escalabilidad horizontal mediante clústeres distribuidos, lo cual resulta consistente con las delimitaciones establecidas en el alcance del proyecto, que excluye explícitamente escenarios de despliegues multinodo o de infraestructura industrial. 

# **4.1.3 Arquitectura lógica del sistema** 

La arquitectura lógica del sistema describe la organización conceptual de los componentes que conforman la plataforma, definiendo cómo se distribuyen las responsabilidades funcionales y cómo se establecen las relaciones de dependencia entre ellos. A diferencia de la 

65 

arquitectura física, que aborda el despliegue real sobre el hardware, la arquitectura lógica se centra en el modelo de organización del software, independiente de la infraestructura específica sobre la cual se ejecutará el sistema. 

Para el presente proyecto se adopta un modelo de arquitectura por capas, fundamentado en los principios descritos en el marco teórico del capítulo III. Este modelo organiza el software en niveles funcionales jerárquicos donde cada capa cumple una responsabilidad específica y se comunica únicamente con las capas inmediatamente adyacentes. La adopción de este patrón obedece a tres razones principales: en primer lugar, su amplia aceptación como estándar en el desarrollo de aplicaciones web modernas, lo cual aporta coherencia con las prácticas actuales de la industria que el estudiante debe conocer; en segundo lugar, su capacidad para favorecer la separación de responsabilidades, atributo esencial para la mantenibilidad del código y para la trazabilidad entre los componentes del sistema; y en tercer lugar, su valor pedagógico, ya que la estructura por capas refleja de forma transparente los conceptos teóricos abordados en el marco conceptual del proyecto. 

La plataforma se estructura en cinco capas lógicas claramente diferenciadas. La capa de presentación corresponde a la interfaz gráfica con la cual interactúa el usuario, implementada mediante la biblioteca React.js. La capa de lógica de negocio alberga las reglas operativas del sistema, las validaciones de dominio y los flujos de orquestación que coordinan las distintas acciones, implementada sobre Node.js. La capa de servicios actúa como intermediaria entre la lógica de negocio y los recursos externos al sistema, exponiendo interfaces de comunicación tanto hacia el cliente como hacia el motor de contenedores Docker. La capa de acceso a datos encapsula las operaciones de persistencia, abstrayendo los detalles específicos del sistema gestor de base de datos respecto del resto del sistema. La capa de base de datos corresponde al almacenamiento físico de la información, implementada mediante PostgreSQL. 

Esta organización por capas se complementa con un componente externo de ejecución de contenedores, que, aunque no constituye una capa lógica del software propio del proyecto, forma parte indispensable del sistema operativo en su conjunto. El motor Docker actúa como recurso externo gestionado a través de la capa de servicios, ejecutando los contenedores que conforman los servicios desplegados por los usuarios de la plataforma. 

66 

El flujo general de información a través de las capas sigue un patrón consistente. Una solicitud iniciada por el usuario desde la capa de presentación viaja hacia la capa de lógica de negocio mediante una petición HTTP intermediada por la capa de servicios. La lógica de negocio aplica las reglas correspondientes —validaciones, verificaciones de recursos, autorizaciones— y, según el caso, consulta o modifica el estado del sistema a través de la capa de acceso a datos. Cuando la operación implica interacción con contenedores, la capa de servicios traduce las instrucciones de negocio en llamadas concretas al motor Docker. Finalmente, los resultados retornan por el mismo camino hasta presentarse al usuario en la interfaz. 

Este modelo de comunicación unidireccional descendente, complementado por respuestas en sentido ascendente, garantiza que los cambios en una capa no afecten directamente al resto del sistema siempre que se respeten las interfaces establecidas. Tal propiedad resulta especialmente valiosa para un prototipo académico, ya que facilita su evolución y su reutilización como base para futuros trabajos de investigación dentro del mismo campo. 

En las siguientes subsecciones se describe en detalle la composición, responsabilidad y tecnología asociada a cada una de las cinco capas que conforman la arquitectura. 

# **4.1.3.1 Capa de presentación** 

La capa de presentación constituye el punto de contacto entre el usuario y el sistema, siendo responsable de exponer las funcionalidades de la plataforma a través de una interfaz gráfica accesible mediante navegador web. Su diseño cumple un doble propósito en el contexto de este proyecto: por un lado, satisface el requisito técnico de proporcionar mecanismos visuales de interacción con el sistema; por otro, asume una función pedagógica al traducir conceptos complejos de contenedorización y administración de recursos en representaciones visuales comprensibles para usuarios en proceso de aprendizaje. 

Esta capa se implementa mediante la biblioteca React.js, seleccionada por tratarse de una de las tecnologías de mayor adopción actual en el desarrollo de interfaces web modernas. React.js permite construir interfaces a partir de componentes reutilizables que encapsulan tanto la estructura visual como el comportamiento asociado, favoreciendo la mantenibilidad del 

67 

código y la consistencia visual del sistema. Adicionalmente, su modelo declarativo facilita la sincronización entre el estado de la aplicación y la representación visual, característica especialmente relevante para una plataforma que requiere actualizaciones dinámicas del estado de los servicios desplegados. 

Las responsabilidades de la capa de presentación se agrupan en cuatro funciones principales. En primer lugar, la renderización de las vistas que componen la aplicación, incluyendo el panel principal, los formularios de creación de servicios, el panel de monitoreo, las pantallas de gestión de módulos educativos y las vistas de evaluación. En segundo lugar, la captura de las interacciones del usuario, traduciendo eventos como pulsaciones de botón, envío de formularios o selección de opciones en solicitudes hacia las capas inferiores. En tercer lugar, la validación inicial de datos en el lado del cliente, aplicando reglas básicas de formato y obligatoriedad antes de enviar la información al servidor, lo cual reduce la carga de procesamiento y mejora la retroalimentación inmediata al usuario. Finalmente, la presentación visual del estado del sistema, mediante indicadores gráficos del consumo de recursos, del estado de ejecución de los servicios y del progreso del estudiante dentro de la ruta de aprendizaje. 

El diseño de esta capa se rige por principios que refuerzan su carácter educativo. Los formularios de configuración siguen el patrón de andamiaje pedagógico descrito en el marco teórico, presentando los campos de forma estructurada con textos de ayuda contextual, ejemplos de valores válidos y mensajes de retroalimentación inmediata. La visualización del consumo de recursos se realiza mediante elementos gráficos como barras de progreso, gráficos circulares e indicadores numéricos que permiten al usuario asociar visualmente cada acción ejecutada con su efecto sobre el servidor. Las acciones críticas —como la eliminación de un servicio— requieren confirmación explícita, aplicando el principio de prevención de errores también descrito en el marco teórico. 

La comunicación de esta capa con el resto del sistema se realiza exclusivamente mediante peticiones HTTP dirigidas a la capa de servicios. Esta separación garantiza que la capa de presentación no contenga lógica de negocio propia ni acceda directamente a la base de datos, 

68 

manteniendo la independencia entre niveles que caracteriza al modelo arquitectónico adoptado. 

Adicionalmente, el desarrollo de esta capa contempla el uso de bibliotecas complementarias que facilitan tareas específicas. Para la gestión del enrutamiento entre vistas se utiliza React Router, mientras que para los componentes de visualización gráfica de métricas se prevé el uso de bibliotecas especializadas como Recharts o Chart.js. La estilización de la interfaz se realiza mediante CSS combinado con un marco de trabajo de utilidades como Tailwind CSS, que favorece la consistencia visual y reduce el tiempo de desarrollo de los componentes. 

En conjunto, la capa de presentación se concibe no únicamente como un envoltorio visual de la funcionalidad del sistema, sino como un componente activo del proceso formativo, diseñado para que cada elemento de la interfaz contribuya a la comprensión de los conceptos técnicos subyacentes. 

# **4.1.3.2 Capa de Lógica de Negocio** 

La capa de lógica de negocio constituye el núcleo funcional del sistema, albergando las reglas que gobiernan el comportamiento de la plataforma y coordinando las operaciones que involucran a las demás capas. Su responsabilidad principal consiste en garantizar que las acciones ejecutadas por los usuarios cumplan con las restricciones del dominio antes de afectar el estado del sistema, ya sea modificando la base de datos, ejecutando comandos sobre el motor Docker o devolviendo información a la interfaz. 

Esta capa se implementa sobre el entorno de ejecución Node.js, complementado por el marco de trabajo Express.js para la construcción de servicios web. La selección de esta tecnología obedece a varias razones convergentes. En primer lugar, Node.js comparte el lenguaje JavaScript con la capa de presentación basada en React.js, lo cual reduce la complejidad cognitiva del desarrollo y facilita la transferencia de conocimiento entre ambos niveles. En segundo lugar, su modelo de ejecución asíncrono basado en eventos resulta especialmente eficiente para operaciones que involucran espera de respuesta de procesos externos, como las llamadas al motor Docker o las consultas a la base de datos. En tercer lugar, el ecosistema de bibliotecas disponibles para Node.js proporciona soluciones maduras para la 

69 

gestión de autenticación, validación de datos, comunicación con sistemas externos y procesamiento de información, lo cual reduce el tiempo de desarrollo del prototipo. 

Las responsabilidades concretas de esta capa se organizan en cinco grupos funcionales. En primer lugar, la validación de reglas de dominio, que verifica que cada solicitud cumpla con las restricciones del negocio: que los recursos solicitados para un servicio respeten los límites configurables del sistema, que los nombres de servicios sean únicos por usuario, que las imágenes Docker especificadas pertenezcan a un catálogo permitido o sigan un formato válido, entre otras. En segundo lugar, la gestión de autenticación y autorización, encargada de verificar la identidad del usuario mediante tokens de sesión y de aplicar las restricciones de acceso correspondientes al rol asignado, ya sea estudiante o administrador docente. En tercer lugar, la orquestación de flujos operativos que involucran múltiples pasos, como el despliegue de un servicio, secuencia que comprende la validación de la configuración, la verificación de recursos disponibles, la generación del comando Docker, la ejecución y el registro del resultado. En cuarto lugar, el procesamiento de la información del componente educativo, incluyendo el cálculo del progreso del estudiante dentro de la ruta de aprendizaje, la asignación de actividades y la evaluación de los resultados obtenidos. Finalmente, la gestión de errores y excepciones, traduciendo los fallos producidos en capas inferiores a mensajes comprensibles que la capa de presentación pueda mostrar al usuario sin exponer detalles técnicos sensibles. 

Esta capa se organiza internamente siguiendo el patrón de separación entre controladores y servicios. Los controladores actúan como puntos de entrada de las peticiones HTTP, encargándose de extraer los parámetros, invocar al servicio correspondiente y construir la respuesta. Los servicios concentran la lógica de negocio propiamente dicha, manteniéndose independientes del protocolo de transporte y reutilizables entre distintos puntos de entrada. Esta separación facilita las pruebas unitarias y refuerza la mantenibilidad del código. 

La comunicación de la capa de lógica de negocio con las capas adyacentes se realiza mediante interfaces bien definidas. Hacia la capa de servicios expone endpoints REST que la interfaz consume, y hacia la capa de acceso a datos invoca funciones específicas que abstraen las operaciones de persistencia. Esta disciplina arquitectónica garantiza que la lógica de negocio permanezca aislada tanto del protocolo de comunicación con el cliente como del 

70 

sistema gestor de base de datos utilizado, atributos coherentes con los requerimientos no funcionales de mantenibilidad y portabilidad establecidos previamente. 

# **4.1.3.3 Capa de Servicios** 

La capa de servicios cumple la función de mediar entre la lógica de negocio del sistema y los recursos externos con los cuales debe interactuar. En el contexto del presente proyecto, esta capa atiende dos tipos de comunicación: hacia los clientes que consumen la plataforma mediante peticiones HTTP, y hacia el motor de contenedores Docker que ejecuta los servicios desplegados por los usuarios. Su existencia como capa independiente permite encapsular la complejidad del transporte y de la integración con sistemas externos, manteniendo la lógica de negocio libre de detalles específicos de estos protocolos. 

La capa se compone de dos subcomponentes principales. El primero es la interfaz de programación de aplicaciones (API) REST, expuesta sobre el protocolo HTTP, que constituye el punto de entrada al sistema desde la capa de presentación. Esta API se estructura siguiendo las convenciones del estilo arquitectónico REST, definiendo recursos identificables mediante rutas claras —usuarios, servicios, módulos, evaluaciones, métricas— y utilizando los verbos HTTP estándar para representar las operaciones aplicables sobre cada recurso. El uso de este estilo aporta uniformidad, predictibilidad y compatibilidad con las prácticas habituales del desarrollo web moderno. La API gestiona aspectos transversales como la deserialización de las peticiones entrantes, la validación de formato, la autenticación mediante tokens y la construcción de respuestas estructuradas en formato JSON. 

El segundo subcomponente es el adaptador hacia el motor Docker, responsable de traducir las operaciones definidas por la lógica de negocio en llamadas concretas al sistema de contenedores. Esta integración se realiza mediante la biblioteca Dockerode, que proporciona acceso programático a la API de Docker desde Node.js, evitando la necesidad de construir y ejecutar manualmente comandos de línea. El uso de esta biblioteca aporta varias ventajas significativas: reduce el riesgo de inyección de comandos al evitar la concatenación directa de cadenas de texto, ofrece manejo estructurado de errores devueltos por Docker y facilita la lectura programática de métricas como el consumo de CPU y memoria de los contenedores 

71 

activos. El adaptador encapsula las operaciones requeridas por el sistema —crear, iniciar, detener, reiniciar y eliminar contenedores, así como consultar su estado y métricas— y expone hacia la lógica de negocio una interfaz simplificada que oculta los detalles de la integración subyacente. 

Esta capa cumple además funciones de seguridad perimetral. Toda petición entrante atraviesa filtros de autenticación y autorización antes de alcanzar la lógica de negocio, y se aplican mecanismos de protección contra prácticas indebidas como solicitudes excesivamente frecuentes, parámetros con formato inválido o intentos de acceso a recursos no autorizados. Estas funciones se implementan mediante middlewares de Express.js que se aplican selectivamente a las rutas que lo requieren. 

Otra responsabilidad relevante de esta capa es la gestión del monitoreo periódico de los servicios desplegados. Dado que el consumo de recursos cambia constantemente, el sistema requiere un mecanismo que consulte estas métricas a intervalos regulares y las haga disponibles para su visualización. El componente de monitoreo, ubicado en esta capa, programa estas consultas, las traduce a llamadas al motor Docker mediante el adaptador correspondiente y publica los resultados de forma que la capa de presentación pueda consumirlos eficientemente, ya sea mediante peticiones periódicas desde el cliente o mediante mecanismos de comunicación basados en eventos servidor. 

Al concentrar la integración con sistemas externos y la mediación con los clientes en una capa específica, la arquitectura preserva la independencia tecnológica de la lógica de negocio. Si en futuras versiones se decidiera modificar el motor de contenedores, agregar un protocolo de comunicación adicional o introducir nuevos clientes, los cambios afectarían exclusivamente a esta capa, sin requerir modificaciones en las reglas del dominio. Esta propiedad refuerza el principio de mantenibilidad establecido entre los requerimientos no funcionales del sistema. 

# **4.1.3.4 Capa de Acceso a Datos** 

La capa de acceso a datos tiene como propósito encapsular las operaciones de lectura y escritura sobre la base de datos, ofreciendo a la lógica de negocio una interfaz uniforme que abstrae los detalles específicos del sistema gestor utilizado. Su existencia como capa 

72 

diferenciada responde al principio arquitectónico de aislar las preocupaciones de persistencia respecto del resto del sistema, lo cual aporta beneficios concretos en términos de mantenibilidad, evolución del modelo de datos y posibilidad de pruebas independientes. 

En el contexto del presente proyecto, esta capa se implementa siguiendo el patrón repositorio, ampliamente adoptado en el desarrollo de aplicaciones empresariales modernas. Bajo este patrón, cada entidad del modelo de dominio cuenta con un repositorio asociado que concentra todas las operaciones de persistencia aplicables sobre ella: consulta por identificador, consulta por criterios, inserción, actualización y eliminación. La lógica de negocio interactúa exclusivamente con estos repositorios, desconociendo si la información se almacena en una base de datos relacional, en un almacén documental o en cualquier otro mecanismo de persistencia. Esta indirección preserva la flexibilidad arquitectónica y simplifica las pruebas, ya que los repositorios pueden ser sustituidos por implementaciones simuladas durante el desarrollo y la validación. 

Para la implementación técnica de esta capa se contempla el uso de un mapeador objetorelacional (ORM), herramienta que automatiza la traducción entre las estructuras del lenguaje de programación y las tablas de la base de datos relacional. Concretamente, se prevé el uso de Prisma o Sequelize, ambas bibliotecas maduras del ecosistema Node.js que ofrecen modelos declarativos, generación de consultas SQL parametrizadas y mecanismos de migración del esquema. La selección final entre ambas alternativas se realizará durante la fase de implementación, considerando criterios como la legibilidad del modelo, la calidad de las herramientas de migración y la madurez del soporte para PostgreSQL. El uso de un ORM aporta ventajas adicionales en términos de seguridad, ya que las consultas se construyen mediante parámetros vinculados que previenen automáticamente la inyección de instrucciones SQL. 

Las responsabilidades de esta capa se estructuran en tres ámbitos principales. En primer lugar, la definición del modelo de persistencia, que establece la correspondencia entre las entidades conceptuales del dominio —usuarios, servicios, módulos, actividades, evaluaciones, registros de despliegue, métricas históricas— y las tablas de la base de datos. En segundo lugar, la ejecución de las operaciones de consulta y modificación, encapsulando cada operación en 

73 

métodos con nombres descriptivos que reflejen la intención del negocio, como obtenerServiciosActivosDeUsuario o registrarResultadoDeEvaluación. En tercer lugar, la gestión de transacciones para operaciones que involucran modificaciones simultáneas sobre múltiples tablas, garantizando la consistencia del estado de la base de datos ante posibles fallos durante la ejecución. 

Esta capa también aplica reglas básicas de integridad antes de delegar las operaciones al sistema gestor. La verificación de existencia de registros referenciados, la validación de formatos esperados por el modelo y la aplicación de valores por defecto cuando corresponde, se ejecutan dentro de los repositorios antes de invocar las funciones del ORM. Esta validación complementa, sin sustituir, las restricciones definidas a nivel de base de datos, las cuales constituyen la última línea de defensa contra inconsistencias en los datos persistidos. 

Al concentrar toda la interacción con la base de datos en una capa específica, el sistema obtiene beneficios concretos en términos de evolución del prototipo. Si durante el desarrollo se identifica la necesidad de modificar el esquema, introducir índices para optimizar consultas frecuentes o reorganizar la estructura de algunas tablas, los cambios afectan exclusivamente a esta capa, sin propagarse al resto del sistema siempre que se preserve la interfaz pública de los repositorios. 

# **4.1.3.5 Capa de Base de Datos** 

La capa de base de datos constituye el componente de almacenamiento persistente del sistema, responsable de conservar toda la información que la plataforma genera, consume o transforma durante su operación. A diferencia de las capas anteriores, que corresponden a código fuente del propio proyecto, esta capa se materializa en un sistema gestor de base de datos independiente, configurado y administrado como un servicio externo del cual depende la aplicación. 

Para esta capa se selecciona PostgreSQL, sistema gestor de base de datos relacional de código abierto reconocido por su robustez, su cumplimiento riguroso del estándar SQL y su amplia adopción tanto en entornos académicos como industriales. Esta elección se sustenta en varios criterios. En primer lugar, la naturaleza de la información manejada por la plataforma 

74 

—entidades estructuradas con relaciones bien definidas entre usuarios, servicios, módulos y evaluaciones— se ajusta naturalmente al modelo relacional. En segundo lugar, PostgreSQL ofrece características avanzadas como soporte para tipos de datos JSON, funciones de ventana, índices especializados y mecanismos de transacciones que cubren con holgura las necesidades del proyecto y permiten una eventual evolución hacia funcionalidades más complejas. En tercer lugar, su carácter abierto resulta coherente con el espíritu del proyecto y con su contexto académico, evitando dependencias de licencias comerciales que limitarían la replicabilidad del experimento. 

El modelo de datos de la plataforma se organiza alrededor de entidades principales que reflejan los conceptos del dominio. Las entidades de gestión de identidad incluyen los usuarios del sistema, sus roles y sus sesiones activas. Las entidades de gestión de servicios registran los servicios desplegados, su configuración, su estado actual, los recursos asignados y el histórico de operaciones realizadas sobre cada uno. Las entidades del componente educativo modelan los módulos de aprendizaje, las actividades que los componen, las asignaciones a estudiantes, las evaluaciones y los resultados obtenidos. Las entidades de monitoreo histórico almacenan registros periódicos del consumo de recursos de los servicios activos, permitiendo análisis posteriores del comportamiento del sistema durante la fase experimental. El detalle completo del modelo de datos y de las relaciones entre entidades se presenta en la sección correspondiente al diagrama entidad-relación. 

La capa de base de datos cumple varias responsabilidades fundamentales. La primera es la persistencia confiable de la información, garantizando mediante mecanismos de transacciones ACID que el estado de los datos permanezca consistente incluso ante fallos imprevistos. La segunda es la aplicación de restricciones de integridad declaradas a nivel del esquema, tales como claves primarias, claves foráneas, restricciones de unicidad y validaciones de dominio, que constituyen la última garantía estructural sobre la calidad de los datos. La tercera es la optimización del rendimiento de las consultas mediante índices apropiados sobre las columnas consultadas con mayor frecuencia, particularmente aquellas utilizadas en las vistas de monitoreo y en la consulta del progreso académico de los estudiantes. La cuarta es la gestión 

75 

de respaldos, mediante mecanismos periódicos que permitan recuperar el estado del sistema en caso de pérdida accidental de información durante la fase experimental. 

Desde el punto de vista del despliegue, la base de datos se ejecutará dentro de un contenedor Docker independiente, configurado mediante volúmenes persistentes que garanticen la conservación de los datos ante reinicios del contenedor. Esta decisión aporta coherencia con la filosofía contenedorizada del proyecto y simplifica la configuración del entorno de desarrollo y pruebas. La conexión entre la capa de acceso a datos y el sistema gestor se realizará mediante credenciales gestionadas a través de variables de entorno, evitando la presencia de información sensible en el código fuente del repositorio. 

En conjunto, la capa de base de datos constituye el cimiento sobre el cual descansa la operación completa del sistema. Su correcta organización resulta crítica no solo para el funcionamiento técnico de la plataforma, sino también para la recolección estructurada de los datos experimentales que sustentarán las conclusiones del proyecto durante la fase de evaluación. 

# **4.1.4 Diagrama de la arquitectura** 

El diagrama de arquitectura constituye la representación visual sintética del modelo lógico descrito en las secciones precedentes, mostrando de forma integrada las cinco capas que conforman el sistema, sus tecnologías asociadas, las relaciones de comunicación entre ellas y la interacción con el motor Docker como recurso externo. Su propósito no es únicamente documental; el diagrama opera como referencia permanente durante las fases de implementación y pruebas, sirviendo como mapa que orienta la ubicación de cada componente dentro de la estructura del proyecto. 

# **Figura 6.** 

Diagrama de la arquitectura 

76 



<!-- Start of picture text -->
Estudiante<br>o docente<br>Capa de presentacion<br>React.js — formularios guiados, validaciones<br>visualizacion de servicios y recursos<br>Capa de servicios Motor<br>Express.js — API REST, autenticaci¢ Docker<br>Capa de Idgica de negocio<br>Node.js — reglas de dominio, orquestacién<br>verificacion de recursos, evaluacion educativa<br>Capa de acceso a datos<br>Prisma / Sequelize — patron repositorio<br>consultas parametrizadas, transacciones<br>Capa de base de datos<br>—_<br><!-- End of picture text -->

# **4.1.5 Identificar las clases** 

La identificación de las clases que conforman el modelo de dominio constituye un paso fundamental en la transición entre la arquitectura general del sistema y su implementación concreta. Las clases representan las abstracciones del mundo real que el software debe modelar para cumplir con su propósito, encapsulando tanto los datos que las caracterizan como las operaciones que pueden ejecutarse sobre ellos. En el contexto del presente proyecto, las clases se derivan directamente de los conceptos del dominio identificados en los requerimientos: usuarios que interactúan con la plataforma, servicios contenedorizados que se despliegan y monitorean, módulos educativos que estructuran el aprendizaje, y registros que conservan la información necesaria para el análisis experimental. 

Para identificar las clases se aplica el método de análisis sustantival, técnica clásica del modelado orientado a objetos que consiste en extraer los sustantivos relevantes presentes en la descripción del dominio y evaluar cuáles de ellos representan entidades persistentes con estado y comportamiento propios. Los sustantivos que únicamente describen atributos de otras entidades se descartan como candidatos a clase, mientras que aquellos que representan conceptos completos del dominio se preservan. El conjunto resultante se organiza en cuatro grupos funcionales que reflejan los ejes principales del sistema: gestión de identidad, gestión de servicios, componente educativo y monitoreo histórico. 

El grupo de gestión de identidad comprende las clases relacionadas con los usuarios del sistema y los mecanismos de autenticación. La clase Usuario representa a cualquier persona registrada en la plataforma, agrupando información común como identificador, nombre, correo electrónico, contraseña cifrada y fecha de registro. La clase Rol modela los distintos perfiles de uso —estudiante y administrador docente—, cada uno asociado a un conjunto específico de permisos que determinan qué operaciones puede ejecutar el usuario dentro del sistema. La clase Sesión representa una autenticación activa, registrando el token emitido, el momento de inicio, el momento de expiración previsto y el estado actual de validez. 

El grupo de gestión de servicios alberga las clases que modelan los servicios contenedorizados desplegados a través de la plataforma. La clase Servicio constituye la entidad central de este grupo y representa una instancia de aplicación contenedorizada gestionada por 

78 

un usuario; agrupa atributos como nombre, descripción, estado de ejecución, fecha de creación y referencia al usuario propietario. La clase ConfiguracionServicio encapsula los parámetros técnicos definidos al momento del despliegue: imagen Docker utilizada, recursos asignados — CPU, memoria y almacenamiento—, puertos expuestos, variables de entorno y volúmenes persistentes. Esta separación entre el servicio como concepto del dominio y su configuración técnica favorece la trazabilidad de cambios en caso de que un servicio sea reconfigurado durante su ciclo de vida. La clase RegistroDespliegue representa cada operación de despliegue realizada sobre un servicio, almacenando la fecha y hora, el usuario que la inició, el resultado obtenido y, en caso de fallo, el mensaje de error correspondiente. 

El grupo del componente educativo modela los elementos que dan soporte a la dimensión pedagógica de la plataforma. La clase Modulo representa una unidad temática dentro de la ruta de aprendizaje, agrupando contenido teórico, actividades prácticas y evaluaciones asociadas. La clase Actividad describe una tarea específica que el estudiante debe realizar como parte de un módulo, incluyendo su descripción, los criterios de validación que determinan su finalización exitosa y el orden que ocupa dentro del módulo. La clase Evaluación modela las evaluaciones formales asociadas a cada módulo, especificando su título, las preguntas o tareas que la componen y el momento en el cual estará disponible para el estudiante. La clase Resultado registra el desempeño de un estudiante en una evaluación o actividad concreta, almacenando la puntuación obtenida, el tiempo empleado, los intentos realizados y la fecha de finalización. Finalmente, la clase RutaAprendizaje representa la secuencia ordenada de módulos asignada a un estudiante, así como su progreso acumulado. 

El grupo de monitoreo histórico agrupa las clases que conservan información temporal sobre el comportamiento de los servicios desplegados. La clase Metrica representa una medición puntual del estado de un servicio en un instante determinado, almacenando el consumo de CPU, el consumo de memoria, el estado de ejecución y la marca de tiempo correspondiente. Esta clase tiene una naturaleza particular: a diferencia de las anteriores, sus instancias se generan automáticamente y de forma periódica por el sistema, no por acción directa del usuario, y su volumen acumulado durante la fase experimental puede alcanzar magnitudes considerables, lo cual influye en las decisiones de modelado de la persistencia. 

79 

Adicional a las clases del dominio descritas, el sistema incorpora clases de servicios de aplicación que no representan entidades persistentes, pero encapsulan responsabilidades operativas relevantes. La clase GestorDocker concentra las operaciones de interacción con el motor de contenedores, exponiendo métodos como crearContenedor, iniciarContenedor, detenerContenedor, eliminarContenedor y obtenerMetricas. La clase VerificadorRecursos evalúa la disponibilidad de recursos del servidor antes de autorizar un despliegue, comparando los recursos solicitados con la capacidad libre del sistema. La clase Autenticador gestiona el ciclo de vida de las sesiones y la validación de credenciales. La clase EvaluadorActividad aplica los criterios de validación correspondientes para determinar si una actividad ha sido completada correctamente por el estudiante. Estas clases, aunque carecen de representación directa en la base de datos, constituyen componentes esenciales de la capa de lógica de negocio y serán representadas posteriormente en el diagrama de clases junto con sus relaciones de uso hacia las entidades del dominio. 

Las relaciones entre las clases identificadas se rigen por las dependencias naturales del dominio. Cada usuario puede tener asociados múltiples servicios, sesiones, asignaciones de ruta de aprendizaje y resultados. Cada servicio tiene exactamente una configuración vigente, múltiples registros históricos de despliegue y múltiples métricas asociadas a lo largo de su existencia. Cada módulo agrupa varias actividades y, opcionalmente, una evaluación. La especificación detallada de la cardinalidad y de la naturaleza de cada relación —asociación, composición o agregación— se desarrolla formalmente en la sección correspondiente al diagrama de clases. 

El conjunto de clases identificadas en esta sección constituye el vocabulario del dominio sobre el cual se construyen las secciones posteriores del capítulo: la especificación formal de requerimientos, los diagramas de comportamiento dinámico, el modelo de datos y, en última instancia, la implementación del sistema en código fuente. 

# **4.1.6 Especificación de los requerimientos del software** 

La especificación de requerimientos del software constituye el documento formal en el cual se consignan, de manera estructurada y trazable, las características que el sistema debe poseer 

80 

para considerarse satisfactorio. A diferencia de la presentación narrativa desarrollada en las secciones 4.1.1 y 4.1.2, la especificación formal asigna a cada requerimiento un identificador único, una descripción precisa, una prioridad relativa y un criterio de aceptación verificable, lo cual permite establecer un vínculo directo entre las necesidades expresadas y los resultados observables durante las pruebas. Esta sección adopta como referencia el estándar IEEE 830, ampliamente aceptado en la industria del software, adaptado a la escala y al carácter académico del presente proyecto. 

# **4.1.6.1 Funciones del proyecto** 

Las funciones del proyecto se definen como el conjunto de capacidades operativas y cualidades sistémicas que la plataforma educativa debe ofrecer para alcanzar los objetivos planteados. Estas funciones se clasifican en dos categorías complementarias: los requerimientos funcionales, que describen las acciones específicas que el sistema debe ejecutar, y los requerimientos no funcionales, que describen las cualidades transversales que el sistema debe poseer durante su operación. Cada función identificada se vincula con uno o varios objetivos específicos del proyecto, lo cual garantiza la coherencia entre la solución diseñada y los propósitos definidos en el capítulo introductorio. 

La codificación de los requerimientos sigue una nomenclatura uniforme que facilita su referencia desde otras secciones del documento y desde los artefactos posteriores de la fase de implementación. Los requerimientos funcionales se identifican con el prefijo RF seguido de un número correlativo de dos dígitos, mientras que los requerimientos no funcionales utilizan el prefijo RNF con la misma estructura. Adicionalmente, cada requerimiento se clasifica según una escala de prioridad de tres niveles —alta, media y baja— que orienta la planificación del trabajo durante las fases sucesivas del proyecto. Los requerimientos de prioridad alta corresponden a funciones esenciales sin las cuales el sistema no podría considerarse mínimamente funcional para los fines del experimento; los de prioridad media corresponden a funciones importantes que aportan valor significativo pero cuya ausencia no compromete la viabilidad del prototipo; los de prioridad baja corresponden a funciones deseables cuya implementación se evaluará en función del tiempo disponible al cierre de la fase de programación. 

81 

Las dos subsecciones siguientes presentan, mediante tablas estructuradas, el catálogo completo de requerimientos funcionales y no funcionales del sistema. Cada entrada contiene el identificador, el nombre del requerimiento, una descripción concisa, el objetivo específico al cual contribuye, el nivel de prioridad asignado y el criterio de aceptación que permitirá verificar su cumplimiento durante la fase de pruebas. 

# **4.1.6.1.1 Requerimientos funcionales** 

Los requerimientos funcionales catalogados a continuación constituyen el conjunto completo de capacidades operativas que el sistema debe ofrecer. Se agrupan en seis categorías que reflejan los ejes funcionales descritos previamente: gestión de identidad, creación y configuración de servicios, verificación de recursos, despliegue y control de servicios, monitoreo, y componente educativo. La columna OE indica el objetivo específico del proyecto al cual contribuye cada requerimiento, utilizando la nomenclatura OE1, OE2 y OE3 correspondientes a los tres objetivos específicos definidos en el capítulo I. 

# **Tabla 1.** 

# Gestión de identidad 

|**ID**<br>RF-<br>01|**Nombre**<br>Registro de<br>usuario|**Descripción**<br>El sistema debe permitir<br>el registro de nuevos<br>usuarios mediante un<br>formulario que capture<br>nombre, correo<br>electrónico, contraseña y<br>rol asignado.|**OE Priorida**<br>OE1 Alta|**d**<br>**Criterio de aceptación**<br>Se crea exitosamente una<br>cuenta nueva validando<br>unicidad del correo<br>electrónico y aplicando<br>cifrado a la contraseña antes<br>de su almacenamiento.|
|---|---|---|---|---|
|RF-<br>02|Autenticación<br>de usuario|El sistema debe permitir<br>el inicio de sesión<br>mediante credenciales<br>validadas y emitir un<br>token de sesión al usuario<br>autenticado.|<br>OE1 Alta|El usuario con credenciales<br>válidas obtiene acceso a las<br>funcionalidades<br>correspondientes a su rol;<br>las credenciales inválidas<br>son rechazadas con un<br>mensaje claro.|
|RF-<br>03|Cierre de<br>sesión|El sistema debe permitir<br>al usuario finalizar su<br>sesión de forma explícita,|OE1 Media|Tras el cierre de sesión, el<br>token asociado es rechazado|



82 

|**ID**|**Nombre**|**Descripción**<br>**OE**<br>invalidando el token<br>emitido.|**Priorid**|**ad**<br>**Criterio de aceptación**<br>por el sistema en cualquier<br>solicitud posterior.|
|---|---|---|---|---|
|RF-<br>04|Gestión de<br>perfiles<br>diferenciados|El sistema debe<br>diferenciar las<br>funcionalidades<br>disponibles según el rol<br>del usuario, restringiendo<br>las operaciones<br>administrativas al perfil<br>docente.<br>OE1|Alta|Un usuario con rol de<br>estudiante no puede acceder<br>a funciones de creación o<br>modificación de módulos<br>educativos; el intento queda<br>registrado en la bitácora del<br>sistema.|



_Nota_ . Fuente propia. Descripción especifica de los requerimientos funcionales relacionados  a la gestión de identidad. 

# **Tabla 2.** 

# Creación y configuración de servicios 

- **ID Nombre Descripción** El sistema debe ofrecer un formulario estructurado para 

- Formulario la definición de un nuevo 

- RFguiado de servicio contenedorizado, OE1 Alta 

- 05 creación de incluyendo nombre, imagen servicio Docker, recursos asignados, puertos, variables de entorno y volúmenes. El sistema debe validar en tiempo real los valores 

- Validación ingresados en el formulario, 

- RFautomática de indicando errores de OE1 Alta 

- 06 parámetros formato, rangos no permitidos o campos obligatorios incompletos. 

# **OE Prioridad Criterio de aceptación** 

El usuario completa el formulario y obtiene como resultado un servicio correctamente configurado, sin necesidad de escribir comandos manualmente. 

Los campos con valores inválidos se señalan inmediatamente con un mensaje descriptivo que orienta la corrección. 

El usuario puede elegir una imagen del catálogo o ingresar manualmente una imagen distinta, manteniendo la validación correspondiente en ambos casos. 

- El sistema debe ofrecer un 

- Catálogo de listado de imágenes Docker 

- RFimágenes pre-verificadas para facilitar OE1 Media 

- 07 sugeridas la selección por parte del estudiante. 

83 

|**ID**|**Nombre**|**Descripción**|**OE Prioridad**|**Criterio de aceptación**|
|---|---|---|---|---|
|||El sistema debe permitir||La modificación se|
|RF-<br>08|Edición de<br>configuración<br>de sericio|modificar la configuración<br>de un servicio existente,<br>generando un nuevo registro|OE1 Media|aplica al siguiente<br>despliegue del servicio y<br>queda registrada en el|
||v|de configuración asociado al||histórico de|
|||mismo servicio.||configuraciones.|



_Nota_ . Fuente propia. Descripción de los requerimientos funcionales de la creación de servicios a través de la plataforma. 

# **Tabla 3.** 

Verificación de recursos 

|**ID**<br>RF-<br>09|**Nombre**<br>Verificación<br>previa de<br>disponibilidad|**Descripción**<br>El sistema debe comprobar<br>la disponibilidad de CPU,<br>memoria y almacenamiento<br>en el servidor antes de<br>autorizar el despliegue de<br>un servicio.|**OE Prioridad**<br> <br>OE2 Alta|**Criterio de aceptación**<br>Si los recursos solicitados<br>superan la capacidad<br>libre, el despliegue es<br>rechazado y se informa al<br>usuario los valores<br>específicos disponibles y<br>solicitados.|
|---|---|---|---|---|
|RF-<br>10|Consulta de<br>capacidad del<br>servidor|El sistema debe exponer<br>una vista que muestre la<br>capacidad total y la<br>capacidad disponible del<br>servidor en términos de<br>CPU, memoria y<br>almacenamiento.|OE2 Alta|La vista se actualiza<br>periódicamente y refleja<br>el estado real del servidor<br>en intervalos no<br>superiores a cinco<br>segundos.|



_Nota_ . Fuente propia. Descripción de los requerimientos funcionales sobre validación de recursos. 

# **Tabla 4.** 

Despliegue y control de servicios 

|**ID**|<br>**Nombre**|**Descripción**|**OE Prioridad**|**Criterio de aceptación**|
|---|---|---|---|---|
|RF-<br>11|Despliegue<br>automatizado|El sistema debe ejecutar el<br>despliegue de un servicio|OE1 Alta|El servicio se ejecuta<br>exitosamente y queda|
|||contenedorizado apartir de||registrado como activo en|



84 

|**ID**|<br>**Nombre**|**Descripción**<br>la configuración validada,<br>sin requerir intervención<br>manual del usuario en la<br>línea de comandos.|**OE Prioridad**|**Criterio de aceptación**<br>la plataforma; el tiempo<br>de despliegue es<br>comparable al de la<br>ejecución manual del<br>comando equivalente.|
|---|---|---|---|---|
|RF-<br>12|Detención de<br>servicio|El sistema debe permitir al<br>usuario detener un servicio<br>activo desde la interfaz<br>gráfica.|OE2 Alta|El servicio pasa al estado<br>detenido y libera los<br>recursos asociados; la<br>acción queda registrada en<br>el histórico.|
|RF-<br>13|Reinicio de<br>servicio|El sistema debe permitir<br>reiniciar un servicio<br>detenido o en ejecución<br>desde la interfaz gráfica.|OE2 Media|El servicio vuelve al<br>estado de ejecución<br>preservando su<br>configuración; la acción<br>queda registrada en el<br>histórico.|
|RF-<br>14|Eliminación de<br>servicio|<br>El sistema debe permitir<br>eliminar un servicio,<br>removiendo el contenedor<br>asociado y liberando los<br>recursos del servidor.|OE2 Alta|El servicio deja de<br>aparecer entre los activos;<br>la información histórica<br>del servicio se preserva<br>con marca de eliminado<br>para fines de análisis<br>posterior.|
|RF-<br>15|Registro de<br>operaciones de<br>despliegue|<br>El sistema debe registrar<br>cada operación de<br>despliegue, detención,<br>reinicio o eliminación,<br>incluyendo usuario, fecha y<br>resultado.|OE2 Alta|Los registros pueden<br>consultarse desde la vista<br>del servicio y desde la<br>vista administrativa de<br>auditoría.|



_Nota_ . Fuente propia. Descripción de los requerimientos funcionales sobre despliegue y control de servicios. 

# **Tabla 5.** 

Monitoreo 

85 

|**ID**<br>RF-<br>16|**Nombre**<br>Panel de<br>servicios<br>activos|**Descripción**<br>El sistema debe presentar<br>un panel con la lista de<br>servicios activos del<br>usuario, su estado de<br>ejecución y su consumo<br>actual de recursos.|**OE Prioridad**<br>OE2 Alta|**Criterio de aceptación**<br>El panel muestra al menos<br>el nombre, el estado, el<br>consumo de CPU y el<br>consumo de memoria de<br>cada servicio,<br>actualizándose<br>automáticamente.|
|---|---|---|---|---|
|RF-<br>17|Visualización<br>detallada de<br>servicio|El sistema debe ofrecer una<br>vista detallada por servicio<br>con información extendida<br>sobre su configuración, su<br>histórico de operaciones y<br>su comportamiento<br>reciente.|<br>OE2 Alta|Desde la vista detallada el<br>usuario accede a la<br>información del servicio<br>sin requerir comandos<br>externos.|
|RF-<br>18|Histórico de<br>métricas|El sistema debe conservar<br>un histórico de las métricas<br>de consumo de los<br>servicios para su análisis<br>posterior.|<br>OE2 Media|Las métricas se almacenan<br>en la base de datos con<br>marca temporal y pueden<br>recuperarse mediante<br>consultas filtradas por<br>servicio y rango de fechas.|
|RF-<br>19|Notificación<br>de errores de<br>servicio|El sistema debe notificar al<br>usuario cuando un servicio<br>activo presente un fallo de<br>ejecución detectable.|<br>OE2 Media|El servicio en estado de<br>error se marca visualmente<br>en el panel y el mensaje de<br>error correspondiente se<br>muestra al usuario.|



_Nota_ . Fuente propia. Descripción de los requerimientos funcionales sobre monitoreo. 

# **Tabla 6.** 

Componente educativo 

|**ID**|<br>**Nombre**|**Descripción**|**OE Prioridad**|<br>**Criterio de aceptación**|
|---|---|---|---|---|
|||El sistema debe permitir|||
|RF-<br>20|Gestión de<br>módulos de<br>aprendizaje|al docente crear,<br>modificar y eliminar<br>módulos de aprendizaje,<br>así como las actividades<br>que los componen.|OE3 Alta|El docente administra el<br>contenido educativo desde<br>la interfaz sin requerir<br>acceso a la base de datos.|



86 

|**ID**<br>RF-<br>21<br>RF-<br>22|<br>**Nombre**<br>Asignación de<br>ruta de<br>aprendizaje<br>Consulta de<br>progreso del<br>estudiante|**Descripción**<br>El sistema debe permitir<br>asignar una ruta de<br>aprendizaje compuesta<br>por módulos secuenciales<br>a un estudiante o grupo<br>de estudiantes.<br>El sistema debe permitir<br>al estudiante consultar su<br>progreso dentro de la ruta<br>de aprendizaje,<br>identificando módulos<br>completados, en curso y<br>pendientes.|**OE Prioridad**<br> <br>OE3 Alta<br> <br>OE3 Alta|<br>**Criterio de aceptación**<br>El estudiante accede<br>únicamente a los módulos<br>que tiene asignados y en el<br>orden establecido por la<br>ruta.<br>La vista de progreso refleja<br>con exactitud el estado de<br>cada módulo y se actualiza<br>automáticamente al<br>completar actividades.|
|---|---|---|---|---|
|RF-<br>23|Validación<br>automática de<br>actividades|El sistema debe evaluar<br>automáticamente la<br>finalización de las<br>actividades prácticas<br>asociadas a un módulo,<br>aplicando los criterios<br>definidos por el docente.|OE3 Alta|Una actividad se marca<br>como completada cuando el<br>estudiante ejecuta las<br>acciones requeridas; los<br>resultados quedan<br>registrados con fecha,<br>tiempo empleado e intentos<br>realizados.|
|RF-<br>24|Aplicación de<br>evaluaciones|El sistema debe permitir<br>al estudiante realizar<br>evaluaciones asociadas a<br>los módulos y registrar<br>los resultados obtenidos.|OE3 Media|El estudiante completa la<br>evaluación y obtiene<br>retroalimentación<br>inmediata sobre su<br>desempeño.|
|RF-<br>25|Consulta de<br>resultados<br>experimentales|El sistema debe permitir<br>al docente consultar los<br>resultados agregados del<br>grupo experimental para<br>fines de análisis<br>comparativo.|OE3 Alta|El docente accede a<br>reportes que incluyen<br>tiempos promedio de<br>despliegue, errores<br>registrados y puntuaciones<br>obtenidas, segmentados por<br>estudianteypor módulo.|



_Nota_ . Fuente propia. Descripción de los requerimientos funcionales sobre el componente educativo. 

# **4.1.6.1.2 Requerimientos no funcionales.** 

Los requerimientos no funcionales catalogados a continuación describen las cualidades transversales que el sistema debe poseer durante su operación, complementando las 

87 

capacidades funcionales especificadas previamente. Se agrupan en siete categorías que reflejan los atributos de calidad descritos en la sección 4.1.2: usabilidad, rendimiento, seguridad, mantenibilidad, portabilidad, disponibilidad y escalabilidad. A diferencia de los requerimientos funcionales, los criterios de aceptación de los requerimientos no funcionales se expresan en términos de umbrales medibles, condiciones verificables o estándares de cumplimiento, lo cual permite su evaluación objetiva durante la fase de pruebas. 

# **Tabla 7.** 

Usabilidad 

|**ID**<br>RNF-<br>01|**Nombre**<br>Curva de<br>aprendizaje<br>reducida|**Descripción**<br>El sistema debe permitir a<br>un estudiante con<br>conocimientos básicos<br>completar su primer<br>despliegue de servicio en<br>un tiempo<br>significativamente menor al<br>requerido mediante línea de<br>comandos.|**Prioridad**<br> <br> <br>Alta|**Criterio de aceptación**<br>Reducción de al menos<br>veinte por ciento en el<br>tiempo promedio de<br>despliegue del grupo<br>experimental respecto al<br>grupo control, conforme<br>al indicador de éxito<br>definido en el proyecto.|
|---|---|---|---|---|
|RNF-<br>02<br>RNF-<br>03|Retroalimentación<br>contextual<br>Consistencia visual|Cada campo de formulario<br>debe ofrecer texto de ayuda<br>contextual, ejemplos de<br>valores válidos y mensajes<br>de error redactados en<br>lenguaje claro.<br> <br>La interfaz debe seguir<br>convenciones de diseño<br>uniformes en todas sus<br>vistas, manteniendo la<br>misma paleta de colores,<br>tipografía y disposición de<br>elementos comunes.|<br>Alta<br>Media|La totalidad de los<br>campos del formulario de<br>creación de servicios<br>cuenta con textos de<br>ayuda visibles y mensajes<br>de error descriptivos.<br>Una revisión visual<br>identifica un único<br>sistema de diseño<br>aplicado a todas las vistas<br>del sistema.|
|RNF-<br>04|Prevención de<br>errores en acciones<br>críticas|Las acciones irreversibles<br>—eliminación de servicios,<br>eliminación de módulos,<br>cierre forzado de<br>sesiones— deben requerir|Alta|Toda acción irreversible<br>presenta un diálogo de<br>confirmación antes de<br>ejecutarse; las acciones<br>canceladas no producen<br>efecto en el sistema.|



88 

|**ID**|**Nombre**|**Descripción**<br>confirmación explícita del<br>usuario.|**Prioridad**|**Criterio de aceptación**|
|---|---|---|---|---|
|||La interfaz debe respetar<br>criterios básicos de<br>accesibilidad como||La interfaz supera las<br>verificaciones<br>automáticas de|
|RNF-<br>05|Accesibilidad<br>básica|contraste de color<br>suficiente, navegación por|Media|accesibilidad<br>correspondientes al nivel|
|||teclado y etiquetas||AA del estándar WCAG|
|||descriptivas en los<br>controles de formulario.||en sus criterios<br>aplicables.|



_Nota_ . Fuente propia. Descripción de los requerimientos no funcionales sobre usabilidad. 

# **Tabla 8.** 

Rendimiento 

|**ID**|**Nombre**|**Descripción**|**Prioridad**|**Criterio de aceptación**|
|---|---|---|---|---|
|RNF-<br>06|Tiempo de<br>respuesta de<br>consultas|Las operaciones de consulta de<br>estado de servicios deben<br>completarse en menos de dos<br>segundos bajo condiciones<br>normales de carga.|Alta|El tiempo medido entre<br>la solicitud y la<br>respuesta en el percentil<br>noventa es inferior a dos<br>segundos durante las<br>pruebas.|
|RNF-<br>07|Tiempo de<br>verificación de<br>recursos|La verificación de<br>disponibilidad de recursos<br>previa a un despliegue debe<br>completarse en menos de tres<br>segundos.|Alta|El tiempo medido para<br>la verificación es<br>inferior a tres segundos<br>en el noventa por ciento<br>de los casos durante las<br>pruebas.|
|RNF-<br>08|Latencia de<br>despliegue<br>aceptable|El tiempo total de despliegue<br>mediante la plataforma no debe<br>superar significativamente el<br>tiempo de ejecución del<br>comando Docker equivalente.|Alta|La diferencia entre el<br>tiempo de despliegue<br>mediante la plataforma y<br>el tiempo de ejecución<br>manual no excede el<br>diez por ciento.|
|||El panel de monitoreo debe||Las métricas mostradas|
|RNF-<br>09|Frecuencia de<br>actualización<br>del monitoreo|actualizar las métricas de<br>consumo de los servicios<br>activos en intervalos no<br>superiores a cinco segundos.|Alta|en el panel reflejan el<br>estado del servidor con<br>un retraso máximo de<br>cinco segundos.|



89 

_Nota_ . Fuente propia. Descripción de los requerimientos no funcionales sobre rendimiento. 

# **Tabla 9.** 

Seguridad 

|**ID**<br>RNF-<br>10|**Nombre**<br><br>Almacenamiento<br>cifrado de<br>contraseñas|**Descripción**<br>Las contraseñas de los<br>usuarios deben<br>almacenarse mediante<br>algoritmos de resumen<br>criptográfico<br>actualizados, nunca en<br>texto plano.|**Prioridad**<br>Alta|<br>**Criterio de aceptación**<br>La inspección de la base de<br>datos confirma que ninguna<br>contraseña se encuentra<br>almacenada en formato<br>legible.|
|---|---|---|---|---|
|RNF-<br>11|Comunicación<br>cifrada|La comunicación entre el<br>cliente y el servidor debe<br>realizarse mediante el<br>protocolo HTTPS cuando<br>el sistema se exponga<br>fuera del entorno local.|<br>Alta|El servidor rechaza<br>conexiones no cifradas<br>cuando se ejecuta en<br>entornos accesibles desde<br>fuera del segmento local.|
|RNF-<br>12|Control de acceso<br>por rol|El sistema debe aplicar<br>restricciones de acceso<br>diferenciadas según el rol<br>del usuario, impidiendo<br>operaciones no<br>autorizadas.|<br>Alta|Las pruebas de acceso<br>confirman que cada rol<br>únicamente puede ejecutar<br>las operaciones permitidas<br>para su perfil.|
|||Los comandos ejecutados<br>sobre Docker deben||El sistema utiliza la<br>biblioteca Dockerode con|
|RNF-<br>13<br>RNF-<br>14|Prevención de<br>inyección de<br>comandos<br><br>Registro de<br>eventos de<br>seguridad|construirse mediante<br>mecanismos que eviten la<br>concatenación directa de<br>cadenas provenientes del<br>usuario.<br>El sistema debe registrar<br>intentos de acceso<br>fallidos, intentos de<br>acceso a recursos no<br>autorizados y<br>operaciones<br>administrativas<br>relevantes.|<br>Alta<br>Media|parámetros estructurados; las<br>pruebas de inyección con<br>valores maliciosos no<br>producen ejecución de<br>instrucciones no autorizadas.<br>La bitácora de seguridad<br>almacena los eventos<br>correspondientes con marca<br>temporal, identificador de<br>usuario y descripción del<br>evento.|



_Nota_ . Fuente propia. Descripción de los requerimientos no funcionales sobre seguridad. 

90 

# **Tabla 10.** 

Mantenibilidad 

|**ID**<br>RNF-<br>15|**Nombre**<br>Estructura por<br>capas|**Descripción**<br>El código fuente debe<br>organizarse siguiendo la<br>arquitectura por capas<br>definida, separando<br>presentación, lógica de<br>negocio, acceso a datos y<br>persistencia.|**Prioridad**<br>Alta|**Criterio de aceptación**<br>La estructura del<br>repositorio refleja la<br>separación entre capas; las<br>dependencias entre<br>módulos respetan el<br>sentido descendente del<br>modelo.|
|---|---|---|---|---|
|RNF-<br>16|Documentación<br>técnica|El código fuente debe incluir<br>comentarios técnicos en los<br>componentes principales, así<br>como un archivo de<br>referencia que describa la<br>organización del proyecto.|<br> <br>Media|El repositorio contiene un<br>archivo README con la<br>descripción de la<br>estructura y comentarios<br>en los módulos críticos.|
|RNF-<br>17|Control de<br>versiones|El proyecto debe utilizar Git<br>para el registro histórico de<br>los cambios realizados<br>durante el desarrollo.|Alta|El repositorio contiene el<br>historial completo de<br>cambios con mensajes<br>descriptivos asociados a<br>cada confirmación.|
|RNF-<br>18|Convenciones de<br>nomenclatura|<br>El código fuente debe seguir<br>convenciones consistentes<br>para el nombrado de<br>variables, funciones,<br>componentesyarchivos.|Media|Una revisión del código<br>identifica el uso uniforme<br>de la convención adoptada<br>a lo largo del proyecto.|



_Nota_ . Fuente propia. Descripción de los requerimientos no funcionales sobre mantenibilidad. 

# **Tabla 11.** 

Portabilidad 

|**ID**|**Nombre**|**Descripción**<br>La plataforma debe<br>ejecutarse sobre cualquier|**Prioridad**|**Criterio de aceptación**<br>El sistema se ejecuta|
|---|---|---|---|---|
|RNF-|Ejecución sobre|servidor Linux con soporte||exitosamente en al menos|
|19|Linux con<br>Docker|para Docker, sin depender<br>de configuraciones|Alta|dos distribuciones Linux<br>distintas con la versión de|
|||específicas del entorno<br>institucional.||Docker requerida.|



91 

|**ID**<br>RNF-<br>20<br>RNF-<br>21|**Nombre**<br><br>Gestión<br>declarativa de<br>dependencias<br><br>Configuración<br>mediante<br>variables de<br>entorno|**Descripción**<br>Las dependencias del<br>software deben gestionarse<br>mediante archivos<br>declarativos que permitan<br>reproducir el entorno de<br>ejecución en máquinas<br>distintas.<br>Los parámetros sensibles o<br>dependientes del entorno<br>deben configurarse mediant<br>variables de entorno,<br>evitando valores codificados<br>en el código fuente.|**Priorid**<br>Alta<br>e<br> <br>Alta|**ad Criterio de aceptación**<br>La instalación en un<br>entorno limpio se completa<br>siguiendo las instrucciones<br>del archivo de referencia,<br>sin pasos adicionales no<br>documentados.<br>El repositorio no contiene<br>credenciales ni direcciones<br>específicas del entorno<br>productivo; toda<br>configuración crítica reside<br>en variables externas al<br>código.|
|---|---|---|---|---|
|_Nota_.<br>**Tabla**<br>Dis<br>**ID**<br>RNF-<br>22|Fuente propia. De<br>**12.**<br>ponibilidad<br>**Nombre**<br><br>Disponibilidad<br>durante sesiones<br>experimentales|scripción de los requerimient<br>**Descripción**<br>El sistema debe estar<br>disponible durante las<br>sesiones de prueba<br>programadas con el grupo<br>experimental.|os no fun<br>**Priorida**<br>Alta|cionales sobre portabilidad.<br>**d**<br>**Criterio de aceptación**<br>Durante las jornadas de<br>evaluación, la plataforma<br>permanece accesible para<br>todos los participantes sin<br>interrupciones que<br>comprometan la sesión.|
|RNF-<br>23|Recuperación tra<br>interrupciones|s<br>En caso de interrupción<br>del servicio, la<br>recuperación mediante<br>reinicio manual debe<br>completarse en un tiempo<br>razonable sin pérdida de<br>informaciónpersistida.|Media|Tras un reinicio del sistema,<br>la información almacenada<br>en la base de datos se<br>preserva íntegramente y la<br>plataforma vuelve a estar<br>operativa en menos de cinco<br>minutos.|



_Nota_ . Fuente propia. Descripción de los requerimientos no funcionales sobre disponibilidad. 

# **Tabla 13.** 

Escalabilidad 

92 

|**ID**<br>RNF-<br>24|**Nombre**<br>Soporte de<br>usuarios<br>concurrentes del<br>grupo<br>experimental|**Descripción**<br>El sistema debe soportar<br>el uso simultáneo del<br>grupo experimental sin<br>degradación apreciable<br>del rendimiento.|**Priorid**<br>Alta|**ad**<br>**Criterio de aceptación**<br>Las pruebas con el número de<br>usuarios concurrentes<br>equivalente a la muestra del<br>experimento se completan<br>dentro de los umbrales de<br>tiempo definidos para las<br>operaciones críticas.|
|---|---|---|---|---|
|RNF-<br>25|Operación<br>dentro de los<br>límites del<br>servidor físico|El sistema debe operar<br>dentro de las capacidades<br>del servidor físico<br>disponible, sin<br>contemplar escalabilidad<br>horizontal mediante<br>clústeres distribuidos.|Alta|Las pruebas confirman que el<br>sistema funciona<br>correctamente con los<br>recursos del servidor único<br>previsto para el experimento,<br>conforme a las delimitaciones<br>delproyecto.|



_Nota_ . Fuente propia. Descripción de los requerimientos no funcionales sobre escalabilidad. 

# **4.1.7 Características del usuario** 

La caracterización de los usuarios del sistema constituye un componente esencial de la fase de diseño, ya que orienta las decisiones relativas a la interfaz, al nivel de detalle técnico expuesto, a la terminología utilizada y a los mecanismos de retroalimentación incorporados en la plataforma. A diferencia de un sistema empresarial dirigido a usuarios técnicos altamente especializados, la plataforma educativa para gestión DevOps debe atender perfiles heterogéneos cuyo nivel de competencia técnica varía considerablemente. Esta sección describe los perfiles identificados, sus competencias previas esperadas, sus motivaciones y sus expectativas frente al sistema. A partir del análisis del contexto académico en el cual se enmarca el proyecto y de los objetivos planteados, se identifican tres perfiles principales de usuario: el estudiante en formación, el administrador docente y el investigador. A continuación, se describe cada uno de ellos. 

# **4.1.7.1 Estudiante en formación** 

El estudiante en formación constituye el usuario principal del sistema y, por extensión, el destinatario primario de las decisiones de diseño adoptadas durante el proyecto. Se trata típicamente de estudiantes universitarios inscritos en programas de Ingeniería en Sistemas, 

93 

Ciencias de la Computación o carreras afines, con edades comprendidas habitualmente entre los dieciocho y los veinticinco años. Su nivel académico corresponde a etapas intermedias o avanzadas de la carrera, momento en el cual encuentran por primera vez los contenidos relacionados con infraestructura, contenedorización y prácticas DevOps. 

En cuanto a sus competencias previas, este perfil posee conocimientos básicos de sistemas operativos Linux, familiaridad con la ejecución de comandos en terminal y nociones generales sobre redes y aplicaciones cliente-servidor. Su exposición previa a Docker es limitada, habiendo realizado en el mejor de los casos ejercicios introductorios sin alcanzar dominio operativo de la herramienta. Domina la navegación web y el uso de aplicaciones gráficas modernas, por lo que las convenciones habituales de las interfaces web no representan una barrera de aprendizaje en sí mismas. 

Sus motivaciones frente a la plataforma se asocian principalmente al deseo de comprender los conceptos técnicos abordados en sus asignaturas con un mínimo de frustración, completar las actividades académicas asignadas dentro de los plazos previstos y desarrollar competencias aplicables en el ámbito profesional. Sus expectativas se orientan a una experiencia de uso fluida, con retroalimentación inmediata sobre las acciones ejecutadas, mensajes de error comprensibles que orienten la corrección y una representación visual que permita asociar cada operación con su efecto observable en el servidor. 

Las dificultades que este perfil suele enfrentar incluyen la abstracción de conceptos como namespaces, cgroups o imágenes en capas, la sintaxis específica de los comandos Docker, la interpretación de mensajes de error técnicos producidos por herramientas de línea de comandos, y la dificultad para conectar las decisiones de configuración con sus consecuencias sobre los recursos del servidor. La plataforma debe diseñarse considerando explícitamente estas dificultades, ofreciendo mecanismos de andamiaje pedagógico que permitan superarlas progresivamente. 

# **4.1.7.2 Administrador docente** 

El administrador docente corresponde al profesor universitario, instructor o tutor responsable de utilizar la plataforma como herramienta de apoyo en sus asignaturas. Se trata 

94 

típicamente de profesionales con formación de licenciatura o posgrado en áreas relacionadas con sistemas, con experiencia docente en infraestructura, redes, sistemas operativos o DevOps. Sus edades habitualmente se encuentran entre los treinta y los cincuenta y cinco años, aunque este rango es indicativo y admite variabilidad significativa. 

En cuanto a sus competencias previas, este perfil posee dominio técnico de Docker y de herramientas de orquestación, conocimiento profundo del ciclo de vida de los contenedores y experiencia en la configuración de entornos de despliegue. Adicionalmente, cuenta con experiencia pedagógica que le permite estructurar contenidos, diseñar evaluaciones y acompañar el proceso de aprendizaje de los estudiantes. Su familiaridad con plataformas educativas digitales —tales como sistemas de gestión del aprendizaje o entornos virtuales institucionales— constituye una base útil para la adopción del sistema. 

Sus motivaciones se orientan a disponer de una herramienta que reduzca el tiempo dedicado a la configuración técnica de los entornos de práctica, que ofrezca trazabilidad sobre el progreso de los estudiantes y que permita evaluaciones comparables entre distintos grupos. Sus expectativas incluyen la posibilidad de definir módulos de aprendizaje estructurados, asignar rutas de aprendizaje a estudiantes o grupos, consultar los resultados obtenidos por los participantes y generar reportes agregados para fines de análisis académico. 

Las dificultades que este perfil puede enfrentar se relacionan principalmente con la curva inicial de adopción de cualquier nueva herramienta educativa, la necesidad de adaptar materiales didácticos preexistentes al formato de módulos de la plataforma y el tiempo requerido para definir los criterios de validación automática de las actividades. La plataforma debe ofrecerle interfaces administrativas claras que minimicen estos costos de adopción. 

# **4.1.7.3 Investigador** 

El investigador corresponde al responsable del proyecto de investigación dentro del cual se enmarca el desarrollo de la plataforma, así como a posibles investigadores externos que utilicen el sistema o sus datos en estudios posteriores. Este perfil tiene una presencia más acotada durante la fase experimental del proyecto, pero su existencia condiciona aspectos 

95 

relevantes del diseño relacionados con la recolección y la consulta de los datos generados durante el uso de la plataforma. 

En cuanto a sus competencias previas, este perfil combina conocimientos técnicos sobre el sistema con formación metodológica en investigación cuantitativa y cualitativa. Es capaz de interpretar registros de actividad, analizar estadísticamente los resultados de las pruebas y formular conclusiones a partir de los datos recolectados. 

Sus motivaciones se relacionan con la posibilidad de validar empíricamente la hipótesis del proyecto, comparar el desempeño entre los grupos experimental y control, y producir evidencia que sustente la utilidad pedagógica de la plataforma. Sus expectativas incluyen el acceso estructurado a los registros de actividad, la posibilidad de exportar los datos para su análisis externo y la trazabilidad completa entre las acciones de los usuarios y los resultados registrados en el sistema. 

Las dificultades que este perfil puede encontrar se asocian principalmente a la calidad y completitud de los datos registrados durante la operación normal de la plataforma. La especificación de los requerimientos funcionales relacionados con el componente educativo y el monitoreo histórico —en particular los identificadores RF-15, RF-18 y RF-25— atiende explícitamente esta necesidad, garantizando que el sistema genere de forma sistemática la información requerida para el análisis experimental. 

# **Tabla 14.** 

Resumen comparativo de perfiles 

|**Característica**|**Estudiante**|**Administrador**<br>**docente**|**Investigador**|
|---|---|---|---|
|Rol principal|Aprende mediante el uso<br>del sistema|Diseña y supervisa el<br>contenido educativo|Analiza los datos<br>generados|
|Competencia técnica<br>previa|<br>Básica a intermedia|Avanzada|Avanzada|
|Frecuencia de uso|Alta durante las sesiones<br>programadas|Media durante el ciclo<br>académico|Puntual al cierre<br>del experimento|
|Acceso a funciones<br>administrativas|No|Sí|Consulta de<br>reportes agregados|



96 

|**Característica**|**Estudiante**|**Administrador**<br>**docente**|**Investigador**|
|---|---|---|---|
|Acceso al<br>despliegue de<br>servicios|Sí, dentro de su ruta<br>asignada|Sí, sin restricciones|Solo lectura|
|Principal necesidad<br>de diseño|Andamiaje pedagógico y<br>retroalimentación clara|Interfaces<br>administrativas<br>eficientes|Trazabilidad y<br>exportación de<br>datos|



_Nota_ . Fuente propia. Descripción de los distintos perfiles del sistema y sus características. 

# **4.1.8 Diagramas y especificaciones de caso de uso** 

Los casos de uso constituyen una técnica de modelado fundamental dentro de UML, orientada a describir las interacciones entre los actores externos del sistema y las funcionalidades que este ofrece. A diferencia de los requerimientos funcionales, que enuncian capacidades del sistema desde una perspectiva técnica, los casos de uso narran secuencias completas de interacción desde la perspectiva del usuario, permitiendo comprender cómo se utilizan las funciones del sistema en escenarios concretos. Esta sección presenta el diagrama de casos de uso de la plataforma y las especificaciones formales de los casos de uso considerados centrales para la operación del sistema. 

97 



<!-- Start of picture text -->
CU-01 Iniciar sesion CU-02 Cerrar sesion<br>CU-08 Ver panel activos CU-09.Consultar historico<br>\ CU-10 Gestionar médulos CU-11 Asignar ruta<br>CU-12 Realizar actividad CU-13 Consultar progreso<br>CU-14 Aplicar evaluacion<br><!-- End of picture text -->

A continuación, se presenta la especificación detallada de los seis casos de uso considerados centrales para la operación de la plataforma. Los casos de uso restantes siguen una estructura análoga y pueden derivarse de los requerimientos funcionales especificados en la sección 4.1.6.1.1. 

# **Tabla 15.** 

CU-03 Crear servicio 

|**Campo**|**Contenido**|
|---|---|
|Identificador|CU-03|
|Nombre|Crear servicio|
|Actor primario|Estudiante|
|Actores<br>secundarios|Motor Docker|
|Precondiciones|El usuario se encuentra autenticado en el sistema con rol de estudiante o<br>docente.|
|Postcondiciones|<sup>Existe en el sistema un nuevo servicio con su configuración asociada, listo</sup><br>para ser desplegado.|
|Disparador|El usuario selecciona la opción de crear un nuevo servicio desde el panel<br>principal.<br>1. El sistema presenta el formulario guiado de creación de servicio. 2. El<br>usuario ingresa el nombre del servicio, selecciona la imagen Docker,<br>define los recursos asignados —CPU, memoria y almacenamiento—,<br>configura los puertos a exponer, las variables de entorno y los volúmenes|
|Flujo principal|persistentes. 3. El sistema valida cada campo conforme se completa,<br>mostrando retroalimentación inmediata. 4. El usuario confirma la creación<br>del servicio. 5. El sistema invoca el caso de uso CU-04 Verificar recursos<br>para validar la disponibilidad antes de proceder. 6. El sistema almacena el<br>servicio y su configuración en la base de datos. 7. El sistema confirma al<br>usuario la creación exitosa.|
|Flujo alternativo<br>A|<br>Si en el paso 3 algún campo presenta un valor inválido, el sistema impide<br>el avance al paso 4 y mantiene la indicación del error hasta que el usuario<br>corrija el valor.|
|Flujo alternativo<br>B|<br>Si en el paso 5 los recursos solicitados exceden la disponibilidad, el sistema<br>informa al usuario el motivo del rechazo y permite modificar la<br>configuración antes de reintentar.|
|Requerimientos<br>asociados|RF-05, RF-06, RF-07, RF-09|



99 

_Nota_ . Fuente propia. Especificación del caso de uso “Crear servicio”. 

# **Tabla 16.** 

CU-04 Verificar recursos 

|**Campo**|**Contenido**|
|---|---|
|Identificador|CU-04|
|Nombre|Verificar disponibilidad de recursos|
|Actor primario|Sistema (caso de uso de inclusión)|
|Actores<br>secundarios|Motor Docker|
|Precondiciones|El sistema dispone de una solicitud de despliegue con los recursos<br>solicitados especificados.|
|Postcondiciones|<sup>El sistema dispone de una respuesta categórica sobre la viabilidad del</sup><br>despliegue, junto con los valores específicos de recursos disponibles.|
|Disparador|Invocación desde el caso de uso CU-03 Crear servicio o CU-05 Desplegar<br>servicio.|
||1. El sistema consulta al motor Docker el consumo actual de los<br>contenedores activos. 2. El sistema obtiene la capacidad total del servidor<br>mediante consulta al sistema operativo. 3. El sistema calcula los recursos|
|Flujo principal|disponibles restando el consumo actual de la capacidad total. 4. El sistema<br>compara los recursos solicitados con los disponibles. 5. Si los recursos<br>solicitados son inferiores o iguales a los disponibles, el sistema retorna una<br>respuesta afirmativa con los valores correspondientes.|
|Flujo alternativo<br>A|<br>Si los recursos solicitados exceden los disponibles, el sistema retorna una<br>respuesta negativa especificando qué recurso resulta insuficiente y por qué<br>margen.|
|Requerimientos<br>asociados|RF-09, RF-10, RNF-07|



# _Nota_ . Fuente propia. Especificación del caso de uso “Verificar recursos”. 

# **Tabla 17.** 

CU-05 Desplegar servicio 

|**Campo**|**Contenido**|
|---|---|
|Identificador|CU-05|
|Nombre|Desplegar servicio contenedorizado|
|Actorprimario|Estudiante|



100 

|**Campo**|**Contenido**|
|---|---|
|Actores<br>secundarios|Motor Docker|
|Precondiciones|Existe un servicio configurado en el sistema; el usuario es el propietario<br>del servicio o tiene permisos suficientes.|
|Postcondiciones|<sup>El servicio se encuentra en estado de ejecución; existe un registro de</sup><br>despliegue asociado a la operación.|
|Disparador|El usuario selecciona la acción de desplegar un servicio desde su panel de<br>servicios.|
|Flujo principal|1. El usuario solicita el despliegue del servicio. 2. El sistema invoca el caso<br>de uso CU-04 Verificar recursos. 3. El sistema construye el comando<br>estructurado equivalente a partir de la configuración almacenada. 4. El<br>sistema envía la solicitud al motor Docker mediante la biblioteca<br>Dockerode. 5. El motor Docker crea e inicia el contenedor. 6. El sistema<br>actualiza el estado del servicio a "en ejecución". 7. El sistema crea un<br>registro de despliegue con la fecha, el usuario responsable y el resultado<br>obtenido. 8. El sistema notifica al usuario el éxito del despliegue.|
|Flujo alternativo<br>A<br>Flujo alternativo<br>B|<br>Si en el paso 2 la verificación de recursos resulta negativa, el caso de uso<br>termina informando el motivo al usuario.<br> <br>Si en el paso 5 el motor Docker produce un error, el sistema registra el<br>fallo, mantiene el servicio en estado "fallido" y notifica al usuario con el<br>mensaje de error correspondiente.|
|Requerimientos<br>asociados|RF-11, RF-15, RNF-08, RNF-13|



_Nota_ . Fuente propia. Especificación del caso de uso “Desplegar servicio”. 

# **Tabla 18.** 

CU-06 Controlar servicio 

|**Campo**|**Contenido**|
|---|---|
|Identificador|CU-06|
|Nombre|Controlar servicio activo|
|Actor primario|Estudiante|
|Actores<br>secundarios|Motor Docker|
|Precondiciones|Existe un servicio desplegado en el sistema; el usuario tiene permisos sobre<br>el servicio.|
|Postcondiciones|<sup>El servicio se encuentra en el nuevo estado solicitado; la operación queda</sup><br>registrada en el histórico.|



101 

**Campo Contenido** El usuario selecciona una acción de control —detener o reiniciar— desde Disparador la vista del servicio. 1. El usuario selecciona la acción deseada. 2. El sistema envía la instrucción correspondiente al motor Docker. 3. El motor Docker ejecuta la acción sobre el contenedor. 4. El sistema actualiza el estado del servicio Flujo principal conforme al resultado de la operación. 5. El sistema registra la operación en el histórico. 6. El sistema actualiza la visualización del estado en el panel del usuario. Flujo alternativo Si la acción es de detención y el servicio no se encuentra activo, el sistema A informa al usuario y no ejecuta la operación. Flujo alternativo Si la acción produce un error en el motor Docker, el sistema preserva el B estado anterior del servicio y notifica al usuario el detalle del fallo. Requerimientos RF-12, RF-13, RF-15 asociados 

_Nota_ . Fuente propia. Especificación del caso de uso “Controlar servicio”. 

# **Tabla 19.** 

CU-08 Ver panel de servicios activos 

|**Campo**|**Contenido**|
|---|---|
|Identificador|CU-08|
|Nombre|Ver panel de servicios activos|
|Actor primario|Estudiante|
|Actores<br>secundarios|Motor Docker|
|Precondiciones|El usuario se encuentra autenticado en el sistema.|
|Postcondiciones|<sup>El usuario visualiza el estado actual de sus servicios activos con sus</sup><br>métricas de consumo.|
|Disparador|El usuario accede al panel principal de la plataforma o solicita la<br>actualización de este.|
||1. El sistema consulta los servicios asociados al usuario. 2. El sistema<br>solicita al motor Docker el estado de ejecución y el consumo actual de<br>recursos de cada contenedor. 3. El sistema integra la información obtenida|
|Flujo principal|en la vista del panel. 4. El sistema presenta al usuario la lista de servicios<br>con su estado, consumo de CPU, consumo de memoria y opciones de<br>control. 5. El sistema programa la actualización periódica de las métricas<br>conforme al intervalo establecido.|



102 

**Campo Contenido** Flujo alternativo Si el usuario no tiene servicios activos, el sistema muestra un mensaje A informativo y ofrece la opción de crear un nuevo servicio. Si la consulta al motor Docker falla parcialmente, el sistema muestra la Flujo alternativo información disponible y señala visualmente los servicios cuyo estado no B pudo recuperarse. Requerimientos RF-16, RF-19, RNF-06, RNF-09 asociados 

_Nota_ . Fuente propia. Especificación del caso de uso “Ver panel de servicios activos”. 

# **Tabla 20.** 

CU-12 Realizar actividad 

|**Campo**|**Contenido**|
|---|---|
|Identificador|CU-12|
|Nombre|Realizar actividad de aprendizaje|
|Actor primario|Estudiante|
|Actores<br>secundarios|Motor Docker|
|Precondiciones|El usuario tiene asignada una ruta de aprendizaje; existe al menos una<br>actividad pendiente en el módulo activo.|
|Postcondiciones|<sup>La actividad se encuentra marcada como completada; el progreso del</sup><br>estudiante se actualiza; el resultado queda registrado.|
|Disparador<br>Flujo principal|El estudiante selecciona una actividad de su módulo en curso.<br>1. El sistema muestra al estudiante la descripción de la actividad y los<br>criterios para completarla. 2. El estudiante ejecuta las acciones requeridas<br>dentro de la plataforma —típicamente operaciones sobre servicios que<br>invocan los casos de uso correspondientes—. 3. El sistema evalúa<br>automáticamente el cumplimiento de los criterios definidos. 4. Si los<br>criterios se cumplen, el sistema marca la actividad como completada. 5. El<br>sistema registra el resultado con la fecha, el tiempo empleado y los intentos<br>realizados. 6. El sistema actualiza la vista de progreso del estudiante.|
|Flujo alternativo<br>A|<br>Si los criterios no se cumplen al momento de la evaluación, el sistema<br>muestra al estudiante la retroalimentación correspondiente y permite<br>continuar intentando.|
|Flujo alternativo<br>B|<br>Si el estudiante abandona la actividad sin completarla, el sistema preserva<br>el progreso parcial y permite retomarla posteriormente.|
|Requerimientos<br>asociados|RF-22, RF-23, RF-24|



103 

_Nota_ . Fuente propia. Especificación del caso de uso “Realizar actividad”. 

El conjunto de casos de uso identificados cubre la totalidad del alcance funcional de la plataforma. Las relaciones de inclusión entre casos de uso —en particular la inclusión de CU04 desde CU-03 y CU-05— reflejan la reutilización de la lógica de verificación de recursos en distintos puntos del flujo operativo, principio coherente con los criterios de mantenibilidad establecidos entre los requerimientos no funcionales del sistema. Las especificaciones detalladas de los casos de uso restantes pueden construirse siguiendo la misma estructura adoptada en esta sección, manteniendo la trazabilidad hacia los requerimientos funcionales que cada uno satisface. 

# **4.1.9 Matriz de requerimientos** 

La matriz de requerimientos constituye una herramienta de trazabilidad que permite visualizar de forma compacta las relaciones entre los requerimientos del sistema y otros artefactos relevantes del proyecto. Su propósito principal es garantizar que cada requerimiento esté efectivamente vinculado con un objetivo del proyecto, con uno o más casos de uso que lo materialicen, y con criterios de verificación que permitan validar su cumplimiento durante la fase de pruebas. Esta trazabilidad bidireccional resulta esencial para asegurar la coherencia del sistema diseñado: por un lado, permite confirmar que todo objetivo del proyecto se encuentra cubierto por al menos un requerimiento; por otro, permite verificar que ningún requerimiento del sistema se incluye sin un propósito claramente justificado. 

La matriz se construye siguiendo el modelo de trazabilidad horizontal, en el cual cada fila representa un requerimiento y las columnas representan los elementos con los cuales se relaciona. Para esta sección se presentan dos matrices complementarias: la primera vincula los requerimientos funcionales con los objetivos específicos del proyecto y con los casos de uso identificados; la segunda vincula los requerimientos no funcionales con los atributos de calidad correspondientes y con los métodos de verificación aplicables. Esta separación obedece a la naturaleza distinta de ambos tipos de requerimientos: mientras los funcionales se verifican mediante la ejecución de los casos de uso, los no funcionales se verifican mediante pruebas específicas de calidad o mediante inspección estructural del sistema. 

104 

# **4.1.9.1 Matriz de trazabilidad de requerimientos funcionales** 

La siguiente matriz vincula cada requerimiento funcional con el objetivo específico del proyecto al cual contribuye y con los casos de uso en los cuales se materializa. La nomenclatura OE1, OE2 y OE3 corresponde respectivamente a los objetivos específicos de diseño de interfaz gráfica con formularios guiados, desarrollo del mecanismo de verificación de recursos y monitoreo, y análisis del efecto de la plataforma sobre el aprendizaje, conforme se definieron en el capítulo introductorio. 

# **Tabla 21.** 

Matriz de trazabilidad de requerimientos funcionales 

|**Requerimi**|**ento**<br>**Nombre**|**OE Casos de uso asociados**|
|---|---|---|
|RF-01|Registro de usuario|OE1 CU-01|
|RF-02|Autenticación de usuario|OE1 CU-01|
|RF-03|Cierre de sesión|OE1 CU-02|
|RF-04|Gestión de perfiles diferenciados|OE1 CU-01, CU-10, CU-15|
|RF-05|Formulario guiado de creación de servic|io OE1 CU-03|
|RF-06|Validación automática de parámetros|OE1 CU-03|
|RF-07|Catálogo de imágenes sugeridas|OE1 CU-03|
|RF-08|Edición de configuración de servicio|OE1 CU-03|
|RF-09|Verificación previa de disponibilidad|OE2 CU-04, CU-05|
|RF-10|Consulta de capacidad del servidor|OE2 CU-08|
|RF-11|Despliegue automatizado|OE1 CU-05|
|RF-12|Detención de servicio|OE2 CU-06|
|RF-13|Reinicio de servicio|OE2 CU-06|
|RF-14|Eliminación de servicio|OE2 CU-07|
|RF-15|Registro de operaciones de despliegue|OE2 CU-05, CU-06, CU-07|
|RF-16|Panel de servicios activos|OE2 CU-08|
|RF-17|Visualización detallada de servicio|OE2 CU-08|
|RF-18|Histórico de métricas|OE2 CU-09|
|RF-19|Notificación de errores de servicio|OE2 CU-08|
|RF-20|Gestión de módulos de aprendizaje|OE3 CU-10|
|RF-21|Asignación de ruta de aprendizaje|OE3 CU-11|
|RF-22|Consulta de progreso del estudiante|OE3 CU-13|
|RF-23|Validación automática de actividades|OE3 CU-12|



105 

|**Requerimi**|**ento**<br>**Nombre**|**OE Casos de uso asociados**|
|---|---|---|
|RF-24|Aplicación de evaluaciones|OE3 CU-14|
|RF-25|Consulta de resultados experimentales|OE3 CU-15, CU-16|



_Nota_ . Fuente propia. Matriz para trazabilidad de los requerimientos funcionales del proyecto. 

# **4.1.9.2 Matriz de trazabilidad de requerimientos no funcionales** 

La siguiente matriz vincula cada requerimiento no funcional con el atributo de calidad correspondiente y con el método de verificación previsto para validar su cumplimiento durante la fase de pruebas del proyecto. 

# **Tabla 22.** 

Matriz de trazabilidad de requerimientos no funcionales 

|**Requerimie**|**nto**<br>**Nombre**|**Atributo de**<br>**calidad**|**Método de verificación**|
|---|---|---|---|
|RNF-01|Curva de aprendizaje<br>reducida|Usabilidad|Comparación experimental<br>entre grupos|
|RNF-02|Retroalimentación<br>contextual|Usabilidad|Inspección estructural de la<br>interfaz|
|RNF-03|Consistencia visual|Usabilidad|Inspección visual<br>sistemática|
|RNF-04|Prevención de errores en<br>acciones críticas|Usabilidad|Pruebas funcionales de<br>acciones irreversibles|
|RNF-05|Accesibilidad básica|Usabilidad|Verificación automática<br>WCAG nivel AA|
|RNF-06|Tiempo de respuesta de<br>consultas|Rendimiento|Medición instrumentada en<br>pruebas de carga|
|RNF-07|Tiempo de verificación de<br>recursos|Rendimiento|Medición instrumentada en<br>pruebas funcionales|
|RNF-08|Latencia de despliegue<br>aceptable|Rendimiento|Comparación con<br>despliegue mediante línea<br>de comandos|
|RNF-09|Frecuencia de actualización<br>del monitoreo|Rendimiento|Medición instrumentada del<br>panel de monitoreo|
|RNF-10|Almacenamiento cifrado de<br>contraseñas|Seguridad|Inspección directa de la base<br>de datos|



106 

|**Requerimie**|**nto**<br>**Nombre**|**Atributo de**<br>**calidad**|**Método de verificación**|
|---|---|---|---|
|RNF-11|Comunicación cifrada|Seguridad|Verificación de<br>configuración del servidor|
|RNF-12|Control de acceso por rol|Seguridad|Pruebas de acceso con<br>cuentas de distintos roles|
|RNF-13|Prevención de inyección de<br>comandos|Seguridad|Pruebas con valores<br>maliciosos en formularios|
|RNF-14|Registro de eventos de<br>seguridad|Seguridad|Inspección de la bitácora del<br>sistema|
|RNF-15|Estructura por capas|Mantenibilidad|<sup>Inspección estructural del</sup><br>repositorio|
|RNF-16|Documentación técnica|Mantenibilidad|<sup>Revisión del archivo</sup><br>README y comentarios|
|RNF-17|Control de versiones|Mantenibilidad|<sup>Inspección del historial de</sup><br>Git|
|RNF-18|Convenciones de<br>nomenclatura|Mantenibilidad|<sup>Revisión de código</sup><br>mediante criterios definidos|
|RNF-19|Ejecución sobre Linux con<br>Docker|Portabilidad|Despliegue en al menos dos<br>distribuciones distintas|
|RNF-20|Gestión declarativa de<br>dependencias|Portabilidad|Reproducción del entorno<br>en máquina limpia|
|RNF-21|Configuración mediante<br>variables de entorno|Portabilidad|Inspección del repositorio|
|RNF-22|Disponibilidad durante<br>sesiones experimentales|Disponibilidad|Bitácora de incidencias<br>durante las sesiones|
|RNF-23|Recuperación tras<br>interrupciones|Disponibilidad|Pruebas de reinicio con<br>verificación de datos|
|RNF-24|Soporte de usuarios<br>concurrentes|Escalabilidad|Pruebas de carga con<br>muestra experimental|
|RNF-25|Operación dentro de los<br>límites del servidor físico|Escalabilidad|Pruebas en hardware del<br>entorno experimental|



_Nota_ . Fuente propia. Matriz para trazabilidad de los requerimientos no funcionales del proyecto. 

# **4.1.9.3 Distribución de los requerimientos por categoría** 

A partir de las matrices presentadas, el conjunto total de requerimientos del sistema se distribuye en cincuenta entradas —veinticinco funcionales y veinticinco no funcionales—. La 

107 

distribución por categoría se resume en la siguiente tabla, la cual permite apreciar el equilibrio entre las dimensiones operativas y las dimensiones de calidad del sistema diseñado. 

# **Tabla 23.** 

Distribución de los requerimientos por categoría 

|**Categoría**<br>**Cantidad Porcentaje**|
|---|
|Gestión de identidad<br>4 RF<br>8%|
|Creación y configuración de servicios 4 RF<br>8%|
|Verificación de recursos<br>2 RF<br>4%|
|Despliegue y control de servicios<br>5 RF<br>10%|
|Monitoreo<br>4 RF<br>8%|
|Componente educativo<br>6 RF<br>12%|
|Usabilidad<br>5 RNF<br>10%|
|Rendimiento<br>4 RNF<br>8%|
|Seguridad<br>5 RNF<br>10%|
|Mantenibilidad<br>4 RNF<br>8%|
|Portabilidad<br>3 RNF<br>6%|
|Disponibilidad<br>2 RNF<br>4%|
|Escalabilidad<br>2 RNF<br>4%|
|**Total**<br>**50**<br>**100%**|



_Nota_ . Fuente propia. La distribución representa la carga de trabajo de cada categoría. 

# **4.1.10 Diagrama de contexto** 

En el diagrama se identifican cinco entidades externas relevantes para la plataforma. El estudiante y el docente corresponden a los actores humanos primarios, intercambiando con el sistema información de configuración, acciones sobre los servicios y, en sentido inverso, retroalimentación visual sobre el estado de las operaciones. El investigador se vincula con el sistema mediante solicitudes de consulta y recepción de datos experimentales para su posterior análisis. El motor Docker constituye un sistema externo del cual la plataforma depende para la ejecución física de los contenedores, intercambiando comandos estructurados y reportes de estado. El servidor físico, finalmente, representa el entorno de ejecución cuya capacidad de 

108 



<!-- Start of picture text -->
Estudiante<br>Actor humano<br>Configuraci6n de servicios, Estado de servicios,<br>acciones de control, métricas de consumo,<br>actividades de aprendizaje  retroalimentacidn visual<br>Plataforma educativa<br>para gestién DevOps<br>7<br>Progreso de estudiantes,— Médulos, aanrutas de Registré o s,e métricas Solicitudesrat de/ consulta Comandos estructurados“SSEstado de contenedores, Consulta de capacidad—~,B . Informacidn=  de recursos<br>reportes agregadosN\ criteriosaprendizaje, de evaluaciona resultadoshistdricas, exportables de datos experimentales. de gestidn12 de contenedores\ métricasans de ejecucion. os yde almacenamiento CPU, memoria. disponibles. .<br>Docente Investigador Motor Docker Servidor fisico<br>Actor humano Actor humano Sistema externo Entorno de efecucién<br><!-- End of picture text -->

requerir persistencia propia. Las relaciones entre clases reflejan las dependencias naturales del dominio: las composiciones —representadas con rombo lleno— indican ciclos de vida acoplados, como ocurre entre Servicio y sus ConfiguracionServicio, RegistroDespliegue y Metrica asociadas; las agregaciones —representadas con rombo vacío— indican asociaciones donde los componentes pueden existir independientemente del agregador, como entre RutaAprendizaje y Modulo; las asociaciones simples representan vínculos funcionales entre entidades, acompañadas de su cardinalidad correspondiente; y las dependencias — representadas con líneas discontinuas— muestran cómo las clases de servicio utilizan las entidades del dominio sin formar parte estructural de ellas. 

# **Figura 9.** 

Diagrama de clases. 

110 



<!-- Start of picture text -->
a)~leaaeEoas<br>Bless=£14g)a)w | USeBZZz%583°288 an<br>R)ER <—<br>Sie<br>218<br>g<br>2AEs<br>gitsa2gaEBaPB) | 82828aagaet|&eeiaEREBeseleesoaes ibyA 483Fa<br>CeB2)=&|]eeE58°lisg8<br>3<br>=<br>gE)B|PaPeZTESEhtttaahaeStet eeRbe tae335pea ,*sa<br>Paeeeeti245 Seesse g33533 ‘, g<br>C,Sigee:eB/5BS |)/@sgat| a92oaeRaS3aa28°8cee3R3agre33ae38SigsBSEaaeFehaedix3533g&a=ERpee&5283&2eesbegBEba Fyag3B3g3335Esgs]3 |e| fe[oeB\—|Ed32z. gRaoa3gRS32383RoeSeegoe328gia229z23R33233a2 BaFA=523B38g22a3g25 ciog *,‘,‘‘iB7.57‘‘ taeB83tee<br>z aoe Be B23<br>zis A 233<br>Fi 2 a & Zee<br>38 Ea 538<br>° 8 g23<br>5 328B33 >a<br>eeBeeps$3538s3355a2424zg¢2SessBagsbeat oe,2.g ~ eeeagasBagser lee|]o822sbooteae 2 geeeePa£2oeg || 3aaa%|¢eoa¢si228)eeaaeza% e283at£233 Fiid3z%&38 38age8=<br>223gosRog8s 3 &388 le geBeetsg aaeé282S338 ||b okaaeSeascakesSssa® aggh22as mh|$s33s|e233ag23soa i24<br>g 8$3 azB55 |* S TOot~eS§Sa}eeaagee228 ||) 98958 Res2B23g 8 Zefeeozhgf | 8s|oslokPix ba. a<br>fgZw iar<br>¥, cad<2<br>btbheheease =& \8<br>RRga588SRAFog ase o ° "3$ wpe<br>g8e3, an<br>S282e233e393g82¢8 ‘,*,‘y<br>sg8ge * es,a, 3 5 L<br>Es 5 fy<br>ESEHg™ Seah8Sea2¢gage32 2 38240<br>s+lanehe Baggagag8<br>@)B)is2232/38aslot| e386a Qa5385 BeBea2253e228R228a33288 Bs88geg3<br>By]8/3082Ssge) }e28e382age8 28g2 Teaegs3eee,eegeT ge53 $=R385 2<br>32)2g$]e3232°/2°3?3 28a g foes233548s2e85y s<br>is ge@ | garg<br>g3<br>ite a lr,veA a2EfBe ” | $2aselzhaae|g2238 geass3)339%58se ||g| 454 Re]lhshee8oe<br>SAASgS525ag aka 5 sf55 SE)Beyea2| | 2882sage8o3Fe8e28 ag|ea*a2ae@ | 1azsSe|3a8 2 2<br>e283a3R5ageB233335.Sag a= FyB)gPegee+leteae2eSoe \\‘\4LEESBI]gigE[eeeS |223|e|e|e2. 8 2 =&aeb/g &82 »|28o| 52aag2)e8ee]ga || |Fe33538]5 Ea2é3||—se 3FA<br>eR g°323 aa9285&2 bysa—{KB}3"| BS)2g)2eoce3/2282&5a]SLR2 ||e Seaesee oeeaa®33PS3 €Ta =32 xLPLLSpa iedRE]EE2sFeH8 e ZsFi=223S &s° Pa.<br>DE 2)&||e | 2a235 c's-<br>\\‘4 £8ParsBe+t<br>% o¢6<br>‘‘ 8a23.<br>5 rae<br>.‘ PaEg 2a<br>‘ RS Be<br>\ 3 ag a8<br>s ee Pas<br>ae a<br>&& 2<br>8B25<br>g<br><!-- End of picture text -->



<!-- Start of picture text -->
Tore<br>[ recit a<br>on<br>Volice: vesion Racuperar 47 P= - aves gr| erate sewtscre sonore<br>SSarowoooooQQQQaoaesSFFOH>O@OOMOAM Seer<br>Recier<br>@&<br><!-- End of picture text -->

# **4.1.13 Diagrama de secuencia** 

El diagrama de secuencia representa la interacción temporal entre los componentes del sistema durante el despliegue automatizado de un servicio contenedorizado, escenario seleccionado por integrar la mayor parte de las capas arquitectónicas descritas en la sección 4.1.3. Los participantes incluidos corresponden directamente a los componentes definidos en el modelo lógico: la vista implementada en React, la API REST construida sobre Express, la capa de lógica de negocio, las clases de servicio VerificadorRecursos y GestorDocker, la capa de acceso a datos, la base de datos PostgreSQL y el motor Docker como sistema externo. El flujo modelado contempla dos bifurcaciones principales mediante fragmentos combinados de tipo alternativo: la primera evalúa la validez de la sesión del usuario, y la segunda determina la disponibilidad de recursos en el servidor físico antes de autorizar la ejecución del contenedor. 

Para cada bifurcación se representan tanto el camino exitoso como el camino alternativo, incluyendo las operaciones de registro correspondientes que garantizan la trazabilidad de las solicitudes rechazadas. Las activaciones de las líneas de vida —representadas mediante rectángulos verticales— evidencian los períodos durante los cuales cada componente mantiene control activo sobre la operación, mientras que las flechas continuas representan invocaciones síncronas y las flechas discontinuas representan las respuestas correspondientes. 

113 



<!-- Start of picture text -->
x vista (React) APL REST (Express) Légica de Negocio Verificadorkecursos GestorDocker Acceso a Datos base de Datos Motor Docker<br>Usuario<br>Solicita desalegar servicia<br>POST /servicios/fidk/desplegar<br>Validar token de sesidn<br>i 401 No autorizado H<br>i Redirigir a inicio de sesién i<br>i igesién valida} i<br>: desplogarServicio(idServicio, idUsuario) i<br>| abtenerCohfiguracian(idServicio) |<br>H SELECT configuracién i<br>i Datos de configuracién |<br>i ConfiguracionServicio i<br>: verificarDisponibilicad(config) |<br>i Cansultdr consuma actual i<br>: Métricas de|contenedores activos :<br>H Calcular recurgos disponibles H<br>i Resultado de verificacién |<br>i] att [Recursos insuficientes] Hi<br>i rogist}arkechazo(motivo) Hn<br>He INSERT registra rechazo B<br>H Confirmacién i<br>" Error: recursos insuficientes "<br>Hi 409 Conflicto con detalle Hh<br>fi] Mostrar mensaje de recursos insuficientes Hi<br>Hh fRecufsos suficientes] Hi<br>P crearContenedor(¢pnfig) i<br>p docker.createContainer(params) p<br>ff TD det contenedor i<br>. container.start() HH<br>Hi Estado: en ejecucién Hi<br>il Despliegue exifoso il<br>P actualizaestadoServicio(activo) i<br>i UPDATE servicio Hi<br>i Confirmacién H<br>if registrprDespliegue(exita) il<br>ps INSERT registro despliegue p<br>H Canfirmacién Hi<br>Hy ok Hi<br>H Desplicgue completado .<br>HI 200 OK con datos del servicio PB<br>i Notificar éxito y actuatizar panel H<br>usuariox Vista (React) API REST (Express) Lagica de Negocio VerificadorRecursos GestorDocker Base de Datos Motor Docker<br><!-- End of picture text -->

# **4.1.14 Diagramas de estado** 

El diagrama de estados representa el ciclo de vida del servicio contenedorizado dentro de la plataforma, entidad seleccionada como sujeto de modelado por su carácter dinámico: a diferencia de las demás abstracciones del dominio identificadas en la sección 4.1.5, el servicio cambia de condición operativa en respuesta a eventos externos provenientes tanto del usuario como del motor Docker, lo cual lo convierte en el elemento más idóneo para ser representado mediante una máquina de estados. El modelo retoma los cuatro estados operativos básicos enunciados en la sección 2.4.1 del marco teórico —en ejecución, detenido, en reinicio y en error—, complementados con los estados Configurado y Eliminado que delimitan los extremos del ciclo de vida del servicio, y con los estados transitorios Desplegando y Reiniciando que representan operaciones en curso sobre el motor Docker. 

El estado Configurado se alcanza al completar el caso de uso CU-03 Crear servicio, momento en el cual el sistema dispone de un servicio con su configuración asociada pero sin contenedor activo. Desde este estado, el evento desplegar() —vinculado al requerimiento funcional RF-11— conduce al estado transitorio Desplegando, sujeto a la guarda de disponibilidad de recursos verificada mediante el caso de uso CU-04. El éxito reportado por el motor Docker conduce al estado En ejecución, mientras que un error técnico durante la creación del contenedor conduce al estado Fallido, en concordancia con el flujo alternativo B del caso de uso CU-05. El estado En ejecución constituye la condición operativa nominal del servicio y desde allí se originan tres transiciones diferenciadas: el evento detener() vinculado al requerimiento funcional RF-12 conduce al estado Detenido liberando los recursos asociados; el evento reiniciar() vinculado al requerimiento funcional RF-13 conduce al estado transitorio Reiniciando, también accesible desde el estado Detenido conforme al criterio del mismo requerimiento; y la detección automática de un fallo de ejecución conforme al requerimiento funcional RF-19 conduce al estado Fallido. El estado Reiniciando retorna al estado En ejecución cuando la operación culmina exitosamente, preservando la configuración previa del servicio. Desde el estado Fallido, el usuario puede invocar nuevamente el evento reiniciar() para intentar recuperar la operación del servicio. 

115 



<!-- Start of picture text -->
Configurado<br>Desplegando<br>Detenido Enejecucion 7 Fallido<br>— le<br>= Eliminado<br>0 oe oO<br><!-- End of picture text -->

_Nota_ . Fuente propia. Diagrama que representa los estados posibles para un servicio gestionado por la plataforma. 

# **4.1.15 Diagrama de interfaz de usuario** 

El diagrama de interfaz de usuario representa la organización jerárquica de las vistas que componen la aplicación y las relaciones de navegación entre ellas, constituyendo el mapa estructural de la interfaz gráfica de la plataforma. Su elaboración resulta esencial como antecedente al diseño detallado de las vistas presentado en la sección 4.1.18, ya que define el conjunto completo de pantallas requeridas para satisfacer los casos de uso identificados y establece los caminos de navegación que debe soportar la implementación basada en React Router descrita en la sección 4.1.3.1. Las vistas se organizan en torno a un panel principal que opera como punto central de navegación una vez completada la autenticación del usuario, desde el cual se accede a cuatro áreas funcionales diferenciadas que reflejan la agrupación temática de los requerimientos funcionales: gestión de servicios contenedorizados, monitoreo histórico, componente educativo desde la perspectiva del estudiante, y administración educativa junto con análisis experimental desde la perspectiva del docente y del investigador. 

El acceso al sistema se realiza mediante dos vistas públicas previas a la autenticación: la vista de inicio de sesión, asociada al caso de uso CU-01 y al requerimiento funcional RF-02, y la vista de registro asociada al requerimiento funcional RF-01, las cuales conducen al panel principal tras una autenticación exitosa o un registro válido. Desde el panel principal, el usuario accede a las cuatro áreas funcionales descritas y dispone de un menú de perfil que incluye la acción de cierre de sesión correspondiente al caso de uso CU-02, conforme al requerimiento funcional RF-03 que invalida el token de sesión emitido. La organización jerárquica del diagrama refleja la separación lógica entre los niveles de acceso y los conjuntos funcionales, manteniendo el principio de consistencia visual establecido por el requerimiento no funcional RNF-03. 

El área de gestión de servicios concentra las vistas necesarias para que el estudiante administre el ciclo de vida de sus servicios contenedorizados, incluyendo el panel de servicios activos descrito por el caso de uso CU-08, el formulario guiado de creación de servicio 

117 

correspondiente al caso de uso CU-03, la vista detallada de servicio asociada al caso de uso CU-06 y al requerimiento funcional RF-17 desde la cual se ejecutan las acciones de control y eliminación, y la vista de capacidad del servidor especificada en el requerimiento funcional RF-10. El área de monitoreo agrupa la vista de histórico de operaciones del caso de uso CU09 y la vista de gráficas de métricas asociada al requerimiento funcional RF-18, vistas que se conectan operativamente con las del área anterior, pero conservan una identidad propia en la navegación. El área de aprendizaje contiene exclusivamente vistas accesibles al estudiante: la vista de su ruta de aprendizaje correspondiente al caso de uso CU-13, la vista de actividad del caso de uso CU-12, y la vista de evaluación del caso de uso CU-14. Finalmente, el área de administración concentra las vistas restringidas al rol docente y al investigador, incluyendo la gestión de módulos del caso de uso CU-10, la asignación de rutas de aprendizaje del caso de uso CU-11, la vista de reportes agregados del caso de uso CU-15 y la vista de exportación de datos del caso de uso CU-16, cuyo acceso queda condicionado al requerimiento funcional RF04 relativo a la gestión de perfiles diferenciados. 

118 



<!-- Start of picture text -->
Iniciar sesion Registro<br>CU-01, RF-02 RF-01<br>Panel principal Perfil y sesion<br>dashboard inicial CU-02, RF-03<br>Servicios Monitoreo Aprendizaje Administracion<br>RF-05 a RF-17 RF-15, RF-18 RF-22 a RF-24 RF-20, 21, 25<br>Panel activos Historico Mi ruta Modulos<br>-U-08, RF-16 -U-09, RF-15 CU-13, RF-22 CU-10, RF-20<br>Crear servicio Meétricas Actividad Asignar rutas<br>-U-03, RF-05 RF-18 CU-12, RF-23 CU-11, RF-21<br>Detalle Evaluacion<br>CU-06, RF-17 CU-14, RF-24<br>Capacidad<br><!-- End of picture text -->

incorpora como sistema externo del cual la plataforma depende para la ejecución física de los contenedores. 

La capa de presentación contiene el componente Aplicación Web implementado sobre React, dentro del cual se desagregan los cinco módulos de interfaz identificados en la sección 4.1.15 —sesión, servicios, monitoreo, aprendizaje y administración—, los cuales comparten el contexto de ejecución del cliente y consumen colectivamente la interfaz IRestAPI provista por la capa de servicios. Esta segunda capa expone dicha interfaz mediante el componente API REST construido sobre Express, encargado del enrutamiento, la deserialización de las peticiones entrantes y la validación de tokens a través de middlewares, e incorpora además el componente Adaptador Docker, implementado sobre la biblioteca Dockerode, que encapsula tanto las operaciones puntuales sobre el motor de contenedores como el componente de monitoreo periódico responsable de consultar las métricas a intervalos regulares. El adaptador requiere la interfaz IDockerEngine, provista por el motor Docker externo, conexión que se materializa en el diagrama mediante el ensamble entre el socket del adaptador y el lollipop del componente externo. 

La capa de lógica de negocio se materializa en el componente Núcleo Lógico, implementado sobre Node.js, el cual provee la interfaz ILogicaNegocio consumida por la API REST y agrupa los controladores de entrada junto con las cuatro clases de servicio identificadas en la sección 4.1.11 —Autenticador, GestorDocker, VerificadorRecursos y EvaluadorActividad—, conforme al patrón de separación entre controladores y servicios descrito en la sección 4.1.3.2. Estas clases concentran las reglas operativas del dominio sin requerir persistencia propia y, a su vez, consumen la interfaz IRepositorios provista por la capa de acceso a datos. Cabe señalar que la clase GestorDocker establece adicionalmente una dependencia de uso hacia el Adaptador Docker de la capa de servicios, dependencia coherente con la separación arquitectónica que reserva a esa capa la mediación con sistemas externos. 

La capa de acceso a datos se representa mediante un único componente que agrupa los repositorios derivados del patrón de mismo nombre —UsuarioRepo, ServicioRepo, MetricaRepo, ModuloRepo y EvaluacionRepo— junto con el mapeador objeto-relacional Prisma o Sequelize que traduce las operaciones del dominio en sentencias SQL 

120 

parametrizadas. Esta capa requiere la interfaz IPersistencia, provista finalmente por la capa de base de datos, en cuyo interior se encuentra el componente PostgreSQL marcado con el estereotipo «database», ejecutado a su vez dentro de un contenedor Docker independiente conforme a lo establecido en la sección 4.1.3.5. 

La notación adoptada sigue las convenciones del lenguaje UML. Los componentes se representan mediante rectángulos con el estereotipo «component»; las interfaces provistas se denotan con notación de paleta o lollipop, consistente en un círculo unido al componente proveedor mediante una línea corta; y las interfaces requeridas se denotan con notación de receptáculo o socket, consistente en un semicírculo abierto hacia el lollipop correspondiente. El ensamble geométrico entre un lollipop y su socket asociado evidencia visualmente el contrato de comunicación entre los componentes involucrados. Los paquetes correspondientes a las capas se representan mediante rectángulos con borde discontinuo y el estereotipo «capa», siguiendo la convención de empaquetamiento aplicada al modelo arquitectónico, mientras que el motor Docker, en su carácter de recurso externo, se distingue cromáticamente del resto y se marca con el estereotipo «external». 

121 



<!-- Start of picture text -->
«capa»<br>Capa de Presentacion<br>«component»<br>Aplicacién Web (React)<br>Sesion Servicios Monitoreo<br>Aprendizaje Administracion<br>«capa»<br>Capa de Servicios<br>«component» «component»<br>API REST (Express) Adaptador Docker _ipock¢ av ee Dock<br>Controladores HTTP (Dockerode) otorj Dockerj<br>Middlewares de autenticacion Monitor periddico ‘STENT ESTE<br>(host Linux)<br>«capa»<br>Capa de Logica de Negocio<br>«component»<br>Nucleo Ldgico (Node.js)<br>Controladores Autenticador GestorDocker<br>VerificadorRecursos EvaluadorActividad<br>«capa»<br>Capa de Acceso a Datos<br>«component»<br>Repositorios (ORM Prisma/Sequelize)<br>UsuarioRepo ServicioRepo MetricaRepo<br>ModuloRepo EvaluacionRepo<br>VY<br>«capa»<br>Capa de Base de Datc “KSEE<br>PostgreSQL<br><!-- End of picture text -->

# **4.1.17 Diagrama ER** 

El diagrama entidad-relación representa la estructura física del modelo de datos sobre el cual descansa la operación del sistema, materializando en términos de tablas, atributos y restricciones de integridad el conjunto de clases del dominio identificadas en la sección 4.1.5 y los principios de persistencia descritos en la sección 4.1.3.5. Su propósito es doble: por una parte, sirve de referencia técnica directa para la generación del esquema sobre PostgreSQL y para la configuración del mapeador objeto-relacional contemplado en la capa de acceso a datos; por otra parte, deja constancia explícita de la traducción que existe entre el modelo conceptual orientado a objetos y la representación relacional adoptada para el almacenamiento. 

El diagrama se construye siguiendo la notación de patas de cuervo, complementada con etiquetas de cardinalidad expresadas mediante los símbolos uno, ene y cero o uno, las cuales facilitan la lectura sin ambigüedad de las relaciones entre entidades. Cada entidad se representa mediante un rectángulo con tres regiones internas: un encabezado coloreado que indica el grupo funcional al que pertenece, una sección superior que contiene la clave primaria identificada con el prefijo PK, y una sección inferior que reúne los atributos descriptivos y las claves foráneas, estas últimas señaladas con el prefijo FK y formateadas en cursiva para diferenciarlas visualmente de los atributos propios de la entidad. 

Las entidades se organizan en los cuatro grupos funcionales ya establecidos en el modelo de clases. El grupo de gestión de identidad agrupa las tablas Rol, Usuario y Sesion, encargadas de la autenticación y la autorización de los actores del sistema. El grupo de gestión de servicios reúne las tablas Servicio, Configuracion_Servicio y Registro_Despliegue, las cuales conservan la información operativa de los contenedores administrados a través de la plataforma. El grupo de monitoreo histórico se compone exclusivamente de la tabla Métrica, cuya estructura responde a la necesidad de almacenar series temporales de consumo generadas de manera periódica por el sistema. Por último, el grupo del componente educativo integra las tablas Ruta_Aprendizaje, Modulo, Ruta_Modulo, Actividad, Evaluacion y Resultado, las cuales sustentan la dimensión pedagógica de la plataforma y la recolección de los datos experimentales que alimentarán la fase de evaluación del proyecto. 

123 

Las relaciones del modelo reflejan las dependencias naturales del dominio. La relación entre Rol y Usuario es de uno a muchos, permitiendo que múltiples usuarios compartan un mismo perfil de permisos. Las relaciones entre Usuario y sus entidades dependientes —Sesion, Servicio, Ruta_Aprendizaje, Registro_Despliegue y Resultado— son todas de uno a muchos, consistentes con el rol del usuario como propietario o iniciador de las operaciones registradas. La relación entre Servicio y Configuracion_Servicio es de uno a uno, restricción implementada mediante una clave foránea con atributo UNIQUE sobre id_servicio, lo cual garantiza que cada servicio mantenga exactamente una configuración vigente. Las relaciones entre Servicio y sus entidades históricas —Registro_Despliegue y Metrica— son de uno a muchos, coherentes con la naturaleza acumulativa de las operaciones de despliegue y de las mediciones periódicas. 

En el ámbito educativo, la relación entre Modulo y Actividad es de uno a muchos, mientras que la relación entre Modulo y Evaluacion adopta la cardinalidad de cero o uno, reflejando el carácter opcional de la evaluación formal asociada a cada módulo. La relación N a M entre Ruta_Aprendizaje y Modulo, requerida para representar la secuencia ordenada de módulos asignados a cada estudiante, se materializa mediante la tabla asociativa Ruta_Modulo, decisión estándar del modelado relacional que permite añadir además el atributo orden_secuencia, necesario para preservar el orden pedagógico definido por el docente. La tabla Resultado, por su parte, se vincula tanto con Evaluacion como con Actividad mediante claves foráneas mutuamente excluyentes: una de las dos toma valor nulo según el origen del resultado registrado, restricción que se complementa con una validación a nivel de aplicación en la capa de lógica de negocio. 

Sobre las restricciones de integridad, todas las claves foráneas declaran reglas de borrado en cascada cuando la dependencia es estructural —como ocurre entre Servicio y Configuracion_Servicio, Registro_Despliegue o métrica— y reglas restrictivas cuando la dependencia es referencial sin acoplamiento de ciclo de vida —como ocurre entre Usuario y Rol, garantizando así la consistencia del esquema frente a operaciones de eliminación. Los atributos correo en Usuario y token en Sesion incorporan adicionalmente restricciones de unicidad declaradas a nivel de esquema, consistentes con los requerimientos no funcionales de seguridad. Estas decisiones de modelado complementan las validaciones de aplicación 

124 

previstas en las capas superiores, proporcionando la última línea de defensa frente a inconsistencias en los datos persistidos. 

# **Figura 15.** 

Diagrama entidad/relación. 

125 



<!-- Start of picture text -->
& = +o<br>‘9®a!Aea8s=sga23&Bo22&2SsFa§58= BR.»RciGiaolgcokeSia|s/7aR | ge2°Foo83FBpSpes38SzR>7~vBD |ofsa|pee» Ty|a>>5 be.|7"RsESELSESEwei/eeSaSE8)6)2|<9£35 2f&sgsses2SSOoeRsetvpdwrBeor>ow§baeS83S I®3eaS3oo 5RBLaeieBoBeS°S52es30oroSecao Be3f=SpoGSSaoO8x yp5a@R&2&S»> Ta)Me)BREsre}=il4i BSssSe5oo°avos | FD|R83°- ee)fe)r oa5acas3°55»Q3&5$8em= Dpry]—,®<br>35 2&3 ° Fma = S3= s 88&® eooa fie)ByS >53so<br>ee88gsARS ie]N>c Fo.3 L5 a5 =om2 eo3g=52<br>gs82 m iS8 <Q oy©<br>=§So58 LySR ° =3 - 9o—2269<br>a8DeBs3 = F - 8 isL<br>és z 8 fey<br>ts}eRS38Sroggs3325Ss883S23 ISa80 FSsS$&3\i©5aaus2arene6ge)£352 2BBRRRBEgs2sc EeBESKeRy PoPpn»/aeiacSf5138|  SS456Seepass+reooaso-ooohOS63.be=}s =Sg@S| vp&®&3<Pa a |nlaaoslz2weRp5|4sl\aan~|@e@acgsgesgepoPsS33SREpo85eaSZs& @}tlcpw=R&aJey5 &co°o=zaa84o“7Ty=ISs<br>rygz3323@ac#32382&2 ee8282=3 60 |od=°=]cS BI 53 2° be)re}to)mz<3 ~gs = sfe2ona2&a cy iSFe|aSa |°2$Sso2°g<br>s 2 B %<br>BS 9<br>CaN5om>t z = r<br>ax<br>a5<br>as)=BS5 ces= 8 3 =<br>Bos2253og2388¢$83aSeaeSecE&833 8he83& 83g 5538 38g<br>gs@ !3 c3 nos~* Z257s$88) @% z<br>ss s ° EEIB Es] e<br>SQs2 a2 R5 = 3 = ae28s; besex Rasssgearae4888 R<br>qaRs4d oO8® a3=g ° 2Re/&sk)<|3oO] 3oO8 o> -»aao5 ia)2ay IoBeR© oofesrstoaBeeS8oka|»ft 6i}<br>3go2§28as88a== =p& a S ° fo}jloA]na eaeg3a a 5 AI$58 233E68Sesase6Bgs ldi |g86eB omQ<br>SooDgac 88=$ [= imecmo gFyg$ 2°z=<br>$3 2 le = g<br>5 5 mi 3g<br>8 nave sz mooeooalg<br>SeS5 xwf|P8)eg?”8ahOTe$82BSSo)KRpw2= erxXwe3& ae3aAaBEB)ee53sele&OD 8pwKR<br>5/8aa-® 55»ocEa BoHuiNiS s ans°Be2s8 £a>a££ie)=|<br>Oofo}fe}2 °8s So=4o wixwiale8SxsBSoaanlaecoelz SBRs8$2inBHSOoOSoessBeocep2ebgheeeaeeci\la2 ovps38Ba lspeK8B° = 322H355o 2B08<br>gla ofs m4a2fe} z asaRs3&<br>g =5 > 32 3§<br>8 85 a 58<br>&<br>Beessae)RER|EDuDteaRRRRRRaoe624<sehaQoolnI¢ z[25°322onoSeFaePSs4s?DSRS!3ssiéDB&Bal68 vig5@B|eo5)8esPyRpe5oS z ~P|83a e bao=3&ga= oSs@®98282és&8<br>as@ bh.8 8»2 a8 $& Bynm r°4<br>23escz 8 Q—= 7 |]<br>EF 36 A<br>8 gS<br>sQ<br>=8<br>3co)8s323s<br>a58<br>Ey<br><!-- End of picture text -->

_Nota_ . Fuente propia. Diagrama central de la base de datos que representa las distintas entidades y sus relaciones entre sí. 

# **4.1.18 Diseño de vistas (mockups)** 

El diseño de las vistas se estructuró en seis bloques funcionales —acceso público, hub principal, gestión de servicios, monitoreo, aprendizaje y administración docente— porque esta agrupación refleja directamente la organización de los casos de uso definidos en la sección 4.1.5 y respeta la separación de responsabilidades entre los perfiles de estudiante y docente. Trabajar las vistas en bloques permite que cada flujo conserve un contexto claro para el usuario: el estudiante encuentra en un mismo espacio todas las acciones relacionadas con la operación de sus servicios, separadas del entorno pedagógico donde avanza en su ruta de aprendizaje, mientras que el docente accede a un módulo administrativo independiente que concentra la gestión de contenido, la asignación de rutas y el análisis de resultados del estudio. Esta segmentación facilita además el desarrollo iterativo del sistema, ya que cada bloque puede implementarse y validarse como una unidad cohesionada antes de integrarse con el resto de la plataforma. 

En cuanto a la consistencia visual y la experiencia de usuario, se definió un patrón único de navegación —barra superior con contexto, menú lateral con bloque activo resaltado y área principal de trabajo— que se mantiene en todas las vistas autenticadas para cumplir con el requisito no funcional de uniformidad de interfaz (RNF-03) y reducir la carga cognitiva del usuario. Cada vista incorpora elementos de andamiaje pedagógico propios del enfoque del proyecto: indicadores de progreso, criterios de verificación visibles, pistas contextuales y resúmenes previos a las acciones críticas, lo cual responde tanto al objetivo educativo del sistema como al requisito de prevención de errores (RNF-04). Asimismo, las vistas administrativas se diseñaron de forma que permitan al docente observar las métricas asociadas a las hipótesis del estudio sin necesidad de exportar datos para cada consulta, ofreciendo así una herramienta operativa que también sirve como apoyo directo a la validación experimental de la plataforma. 

Este es un resumen de la división y categorización de las vistas: 

127 



<!-- Start of picture text -->
VISTA 01 — INICIO DE SESION - CU-01/ RF-02<br>DevOpsEdu<br>Iniciaree sesionos<br>“ de con tu T i in icionale<br>CORREO INSTITUCIONAL<br>CONTRASENA<br>®<br>Recordar sesién eOlvidaste tu contrasefia?<br>Ingresar<br>El cam Teo debe pertenecer al dominio instituci<br>{No tienes cuenta? Registrate aqui<br><!-- End of picture text -->



<!-- Start of picture text -->
VISTA 02 — REGISTRO DE USUARIO- RF-01<br>DevOpsEdu<br>Crear cuenta<br>Completa tus datos para accedera ataforma<br>NOMBRE COMPLETO<br>NUMERO DE CARNET ROL<br>Estudiante Mv<br>CORREO INSTITUCIONAL<br>jbarrera@miumg.edu.gt<br>CONTRASENA<br>CONFIRMAR CONTRASENA<br>Acepto los términos de uso académico de la plataforma<br>Crear cuenta<br><!-- End of picture text -->



<!-- Start of picture text -->
Q a<br>| @<br>O fo) N © 8<br>8<br>fe)<br>oN<br>o)<br><!-- End of picture text -->



<!-- Start of picture text -->
><br><!-- End of picture text -->



<!-- Start of picture text -->
| o___®<br>———o<br>—o<br>_. |<br><!-- End of picture text -->



<!-- Start of picture text -->
ioo6|l6wG™<br>|<br>ee<br><!-- End of picture text -->







<!-- Start of picture text -->
| ,<br>a TULL ree<br><!-- End of picture text -->







<!-- Start of picture text -->
VISTA 12 — EVALUACION DE MODULO - CU-14 / RF-24<br>DevOpsEdu endizaje / Evaluacione 5: Almacenamie ene: Julién Barre<br>NAVECRCION EVALUACION DE MODULO 5 - INTENTO 1 DE 2<br>Inicio Almacenamientoesponde las 5 preguntas. Necesitas  y70  volimenes/ 100 par a p  persistentes ‘>) 12:34SIEMPCIREST RTE me<br>Gestion de servicios<br>Monitoreo PROGRESO Pregunta3de 5 -@ : 5 Re: Hao<br>| Aprendizaje<br>PREGUNTA 3 0 2<br>Activida éCual de las siguientes afirmaciones describe mejor<br>SES la diferencia entre un volumeny un bind mount?<br>A. Ambos son idénticos en funcionamiento, la diferencia es Gnicamente sintdctica.<br><!-- End of picture text -->



<!-- Start of picture text -->
@<br>| Q<br>e<br><!-- End of picture text -->







<!-- Start of picture text -->
a.<br><!-- End of picture text -->

