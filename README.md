PRACTICA DE BASES DE DATOS 
--
PARTE 3.1 
-
se contiene lo siguientes los archivos en el repositorio que perteneces a la parte 3.1 
    index.html
    index.j
    package.json
 
DECISIÓN DE TECNOLOGÍAS
-
Desarrollar una aplicación web gratuita utilizando tecnologías como MongoDB, Render, JavaScript y GitHub ofrece múltiples ventajas que abarcan desde la eficiencia en el manejo de datos hasta la facilidad de despliegue y colaboración. Cada una de estas herramientas aporta un valor específico que justifica su elección en un proyecto de desarrollo web moderno.

MongoDB es una base de datos NoSQL que permite almacenar información en formato de documentos JSON, lo que facilita la gestión de datos no estructurados o semi-estructurados. Su flexibilidad permite escalar la aplicación de manera sencilla, adaptándose a distintos volúmenes de información sin requerir cambios complejos en la estructura de la base de datos. Además, MongoDB ofrece alto rendimiento en consultas y operaciones de escritura, lo que es ideal para aplicaciones web que necesitan manejar grandes cantidades de datos de manera rápida y eficiente.

Render es una plataforma de hosting que simplifica el despliegue de aplicaciones web, permitiendo que los desarrolladores publiquen sus proyectos sin preocuparse por la infraestructura subyacente. Al ofrecer un servicio gratuito para aplicaciones básicas, Render se convierte en una opción accesible para proyectos personales o educativos. Su integración con repositorios de código y su capacidad para desplegar aplicaciones automáticamente cuando se realizan cambios en el código permiten un flujo de trabajo ágil y continuo.

JavaScript es el lenguaje de programación por excelencia para el desarrollo web, ya que permite construir aplicaciones interactivas y dinámicas en el navegador. Su versatilidad y la gran cantidad de librerías y frameworks disponibles facilitan la creación de funcionalidades complejas sin necesidad de múltiples lenguajes. Además, al ser un lenguaje ampliamente adoptado, garantiza una gran comunidad de soporte y recursos educativos, lo que acelera el proceso de aprendizaje y solución de problemas durante el desarrollo.

GitHub es la plataforma ideal para el control de versiones y la colaboración en proyectos de software. Permite llevar un registro detallado de los cambios realizados en el código, facilitando la identificación de errores y la implementación de mejoras sin afectar la versión estable de la aplicación. Además, GitHub fomenta la colaboración entre desarrolladores al permitir trabajar de manera simultánea en diferentes ramas y fusionar cambios de manera organizada, lo que es fundamental para proyectos que evolucionan constantemente.

En conjunto, estas tecnologías ofrecen un ecosistema completo para desarrollar aplicaciones web gratuitas de manera eficiente, escalable y colaborativa, permitiendo a cualquier persona materializar sus ideas digitales con herramientas modernas y accesibles.

ARQUITECTURA DE LA SOLUCIÓN
--
La arquitectura de este sistema se puede describir como una aplicación web basada en Node.js con arquitectura cliente-servidor y persistencia de datos en MongoDB, utilizando Express como framework principal. A continuación se detallan los componentes y capas principales:

Capa de Servidor (Backend)

Node.js + Express

Node.js actúa como entorno de ejecución del servidor.

Express proporciona la infraestructura para definir rutas HTTP, manejo de solicitudes y respuestas, y middleware.

Se configura para recibir datos en formato JSON y URL-encoded (app.use(express.json()), app.use(express.urlencoded(...))).

Rutas HTTP

HTML

GET / → página principal con interfaz para registrar estudiantes.

GET /estudiantes → página para visualizar la lista de estudiantes en formato HTML.

API REST (JSON)

GET /api/estudiantes → obtiene todos los estudiantes.

POST /api/estudiantes → registra un nuevo estudiante.

GET /api/estudiantes/:matricula → consulta un estudiante por matrícula.

DELETE /api/estudiantes/:matricula → elimina un estudiante.

GET /api/status → verifica el estado del servidor y de la base de datos.

Modelo de Datos (Mongoose)
--

Se define un esquema de estudiante con campos como: nombre, apellido, matrícula, carrera, semestre, email y fechaRegistro.
Mongoose se encarga de la comunicación con MongoDB, la validación de datos y la gestión de documentos.

Conexión a Base de Datos
--
La conexión se realiza mediante mongoose.connect(process.env.MONGODB_URI).
MongoDB almacena los estudiantes como documentos en una colección, ofreciendo persistencia y consultas rápidas.

PARTE 4.1
--

