-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-12-2024 a las 18:11:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `omeka`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_collections`
--

CREATE TABLE `omeka_collections` (
  `id` int(10) UNSIGNED NOT NULL,
  `public` tinyint(4) NOT NULL,
  `featured` tinyint(4) NOT NULL,
  `added` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `modified` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `owner_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_collections`
--

INSERT INTO `omeka_collections` (`id`, `public`, `featured`, `added`, `modified`, `owner_id`) VALUES
(1, 1, 0, '2024-12-13 14:16:30', '2024-12-21 11:27:58', 1),
(2, 1, 1, '2024-12-13 14:17:33', '2024-12-21 11:27:50', 1),
(3, 0, 0, '2024-12-13 14:18:08', '2024-12-20 15:19:39', 1),
(4, 1, 0, '2024-12-13 14:18:30', '2024-12-21 11:27:35', 1),
(5, 0, 0, '2024-12-13 14:18:54', '2024-12-20 15:20:55', 1),
(6, 0, 0, '2024-12-13 14:19:13', '2024-12-20 15:17:42', 1),
(7, 1, 0, '2024-12-13 14:19:38', '2024-12-21 11:27:28', 1),
(8, 1, 0, '2024-12-13 14:20:02', '2024-12-21 11:27:23', 1),
(9, 1, 0, '2024-12-13 14:20:26', '2024-12-21 11:27:17', 1),
(10, 1, 0, '2024-12-13 14:39:55', '2024-12-21 11:27:11', 1),
(11, 1, 0, '2024-12-20 15:25:55', '2024-12-21 11:27:04', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_elements`
--

CREATE TABLE `omeka_elements` (
  `id` int(10) UNSIGNED NOT NULL,
  `element_set_id` int(10) UNSIGNED NOT NULL,
  `order` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_elements`
--

INSERT INTO `omeka_elements` (`id`, `element_set_id`, `order`, `name`, `description`, `comment`) VALUES
(1, 3, NULL, 'Text', 'Any textual data included in the document', NULL),
(2, 3, NULL, 'Interviewer', 'The person(s) performing the interview', NULL),
(3, 3, NULL, 'Interviewee', 'The person(s) being interviewed', NULL),
(4, 3, NULL, 'Location', 'The location of the interview', NULL),
(5, 3, NULL, 'Transcription', 'Any written text transcribed from a sound', NULL),
(6, 3, NULL, 'Local URL', 'The URL of the local directory containing all assets of the website', NULL),
(7, 3, NULL, 'Original Format', 'The type of object, such as painting, sculpture, paper, photo, and additional data', NULL),
(10, 3, NULL, 'Physical Dimensions', 'The actual physical size of the original image', NULL),
(11, 3, NULL, 'Duration', 'Length of time involved (seconds, minutes, hours, days, class periods, etc.)', NULL),
(12, 3, NULL, 'Compression', 'Type/rate of compression for moving image file (i.e. MPEG-4)', NULL),
(13, 3, NULL, 'Producer', 'Name (or names) of the person who produced the video', NULL),
(14, 3, NULL, 'Director', 'Name (or names) of the person who produced the video', NULL),
(15, 3, NULL, 'Bit Rate/Frequency', 'Rate at which bits are transferred (i.e. 96 kbit/s would be FM quality audio)', NULL),
(16, 3, NULL, 'Time Summary', 'A summary of an interview given for different time stamps throughout the interview', NULL),
(17, 3, NULL, 'Email Body', 'The main body of the email, including all replied and forwarded text and headers', NULL),
(18, 3, NULL, 'Subject Line', 'The content of the subject line of the email', NULL),
(19, 3, NULL, 'From', 'The name and email address of the person sending the email', NULL),
(20, 3, NULL, 'To', 'The name(s) and email address(es) of the person to whom the email was sent', NULL),
(21, 3, NULL, 'CC', 'The name(s) and email address(es) of the person to whom the email was carbon copied', NULL),
(22, 3, NULL, 'BCC', 'The name(s) and email address(es) of the person to whom the email was blind carbon copied', NULL),
(23, 3, NULL, 'Number of Attachments', 'The number of attachments to the email', NULL),
(24, 3, NULL, 'Standards', '', NULL),
(25, 3, NULL, 'Objectives', '', NULL),
(26, 3, NULL, 'Materials', '', NULL),
(27, 3, NULL, 'Lesson Plan Text', '', NULL),
(28, 3, NULL, 'URL', '', NULL),
(29, 3, NULL, 'Event Type', '', NULL),
(30, 3, NULL, 'Participants', 'Names of individuals or groups participating in the event', NULL),
(31, 3, NULL, 'Birth Date', '', NULL),
(32, 3, NULL, 'Birthplace', '', NULL),
(33, 3, NULL, 'Death Date', '', NULL),
(34, 3, NULL, 'Occupation', '', NULL),
(35, 3, NULL, 'Biographical Text', '', NULL),
(36, 3, NULL, 'Bibliography', '', NULL),
(37, 1, 8, 'Contributor', 'An entity responsible for making contributions to the resource', NULL),
(38, 1, 15, 'Coverage', 'The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant', NULL),
(39, 1, 4, 'Creator', 'An entity primarily responsible for making the resource', NULL),
(40, 1, 7, 'Date', 'A point or period of time associated with an event in the lifecycle of the resource', NULL),
(41, 1, 3, 'Description', 'An account of the resource', NULL),
(42, 1, 11, 'Format', 'The file format, physical medium, or dimensions of the resource', NULL),
(43, 1, 14, 'Identifier', 'An unambiguous reference to the resource within a given context', NULL),
(44, 1, 12, 'Language', 'A language of the resource', NULL),
(45, 1, 6, 'Publisher', 'An entity responsible for making the resource available', NULL),
(46, 1, 10, 'Relation', 'A related resource', NULL),
(47, 1, 9, 'Rights', 'Information about rights held in and over the resource', NULL),
(48, 1, 5, 'Source', 'A related resource from which the described resource is derived', NULL),
(49, 1, 2, 'Subject', 'The topic of the resource', NULL),
(50, 1, 1, 'Title', 'A name given to the resource', NULL),
(51, 1, 13, 'Type', 'The nature or genre of the resource', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_element_sets`
--

CREATE TABLE `omeka_element_sets` (
  `id` int(10) UNSIGNED NOT NULL,
  `record_type` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_element_sets`
--

INSERT INTO `omeka_element_sets` (`id`, `record_type`, `name`, `description`) VALUES
(1, NULL, 'Dublin Core', 'The Dublin Core metadata element set is common to all Omeka records, including items, files, and collections. For more information see, http://dublincore.org/documents/dces/.'),
(3, 'Item', 'Item Type Metadata', 'The item type metadata element set, consisting of all item type elements bundled with Omeka and all item type elements created by an administrator.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_element_texts`
--

CREATE TABLE `omeka_element_texts` (
  `id` int(10) UNSIGNED NOT NULL,
  `record_id` int(10) UNSIGNED NOT NULL,
  `record_type` varchar(50) NOT NULL,
  `element_id` int(10) UNSIGNED NOT NULL,
  `html` tinyint(4) NOT NULL,
  `text` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_element_texts`
--

INSERT INTO `omeka_element_texts` (`id`, `record_id`, `record_type`, `element_id`, `html`, `text`) VALUES
(1, 1, 'Item', 50, 0, 'Bad Bunny'),
(2, 2, 'Item', 50, 0, 'Wagon Wheel (Old Crow Medicine Show)'),
(3, 3, 'Item', 50, 0, 'Animals (Martin Garrix)'),
(4, 4, 'Item', 50, 0, 'Bad Romance (Lady Gaga)'),
(5, 5, 'Item', 50, 0, 'Lacrimosa (Mozart)'),
(6, 6, 'Item', 50, 0, 'Stay (Justin Bieber)'),
(7, 7, 'Item', 50, 0, 'Back in Black (AC/DC)'),
(8, 8, 'Item', 50, 0, 'The girl from Ipanema (Antonio Carlos Jobim)'),
(9, 9, 'Item', 50, 0, 'Take me home, Country Roads (John Denver)'),
(10, 10, 'Item', 50, 0, 'Cayó la Noche Remix'),
(11, 11, 'Item', 50, 0, 'Yellow (Coldplay)'),
(12, 12, 'Item', 50, 0, 'Te boté Remix'),
(13, 13, 'Item', 50, 0, 'Adele'),
(14, 14, 'Item', 50, 0, 'Mora'),
(15, 15, 'Item', 50, 0, 'Rosalía'),
(16, 16, 'Item', 50, 0, 'Memorias ft. Jhayco'),
(17, 17, 'Item', 50, 0, 'Joji'),
(19, 19, 'Item', 50, 0, 'La Inocente ft. Feid'),
(20, 20, 'Item', 50, 0, 'Quevedo'),
(21, 21, 'Item', 50, 0, 'Devuélveme a mi chica'),
(22, 22, 'Item', 50, 0, 'Kanye West'),
(23, 23, 'Item', 50, 0, 'Mac DeMarco'),
(24, 24, 'Item', 50, 0, 'Smells like teen spirit (Nirvana)'),
(25, 25, 'Item', 50, 0, 'Nectar'),
(26, 26, 'Item', 50, 0, 'The Bones (Maren Morris)'),
(27, 27, 'Item', 50, 0, 'Niggas in Paris (JAY-Z)'),
(28, 28, 'Item', 50, 0, 'ESTE (El Alfa)'),
(29, 29, 'Item', 50, 0, 'EL CHACAL (Mora)'),
(30, 30, 'Item', 50, 0, 'No More Parties in LA (Kanye West)'),
(31, 31, 'Item', 50, 0, 'Dream On (Aerosmith)'),
(32, 32, 'Item', 50, 0, 'Sweet Child O\' Mine'),
(33, 33, 'Item', 50, 0, 'i like the way you kiss me'),
(34, 1, 'Collection', 50, 0, 'Rock'),
(35, 1, 'Collection', 44, 0, 'Español'),
(36, 1, 'Collection', 51, 0, 'Música'),
(37, 2, 'Collection', 50, 0, 'Pop'),
(38, 2, 'Collection', 44, 0, 'Español'),
(39, 2, 'Collection', 51, 0, 'Música'),
(40, 3, 'Collection', 50, 0, 'Música Urbana'),
(41, 3, 'Collection', 44, 0, 'Español'),
(42, 3, 'Collection', 51, 0, 'Música'),
(43, 4, 'Collection', 50, 0, 'Country'),
(44, 4, 'Collection', 44, 0, 'Español'),
(45, 4, 'Collection', 51, 0, 'Música'),
(46, 5, 'Collection', 50, 0, 'Metal'),
(47, 5, 'Collection', 44, 0, 'Español'),
(48, 5, 'Collection', 51, 0, 'Música'),
(49, 6, 'Collection', 50, 0, 'Jazz'),
(50, 6, 'Collection', 44, 0, 'Español'),
(51, 6, 'Collection', 51, 0, 'Música'),
(52, 7, 'Collection', 50, 0, 'Música Clásica'),
(53, 7, 'Collection', 44, 0, 'Español'),
(54, 7, 'Collection', 51, 0, 'Música'),
(55, 8, 'Collection', 50, 0, 'Electrónica'),
(56, 8, 'Collection', 44, 0, 'Español'),
(57, 8, 'Collection', 51, 0, 'Música'),
(58, 9, 'Collection', 50, 0, 'Alternativa'),
(59, 9, 'Collection', 44, 0, 'Español'),
(60, 9, 'Collection', 51, 0, 'Música'),
(61, 34, 'Item', 50, 0, 'Fly Me to the Moon (Frank Sinatra)'),
(62, 35, 'Item', 50, 0, 'Birds Of Fire (Mahavishnu Orchestra)'),
(63, 36, 'Item', 50, 0, 'Selected (Charlotte de Witte)'),
(64, 37, 'Item', 50, 0, 'One Kiss (Calvin Harris & Dua Lipa)'),
(65, 38, 'Item', 50, 0, 'Like a Bitch (Zomboy)'),
(66, 39, 'Item', 50, 0, 'Video Games (Lana del Rey)'),
(67, 40, 'Item', 50, 0, 'Creep (Radiohead)'),
(68, 41, 'Item', 50, 0, 'xanny (Billie Eilish)'),
(69, 42, 'Item', 50, 0, 'La Nozze di Fígaro (Mozart)'),
(70, 43, 'Item', 50, 0, 'Pierrot Lunaire (Arnoldo Schoenberg)'),
(71, 44, 'Item', 50, 0, 'Dies Irae (cánticos gregorianos)'),
(72, 10, 'Collection', 50, 0, 'Música Folklórica'),
(73, 10, 'Collection', 44, 0, 'Español'),
(75, 45, 'Item', 50, 0, 'Malamente (Rosalía)'),
(76, 42, 'Item', 49, 0, 'Música Clásica, Ópera'),
(77, 42, 'Item', 41, 0, '\"Le Nozze di Figaro\" es una ópera cómica en cuatro actos compuesta por Wolfgang Amadeus Mozart. Basada en la obra de teatro La folle journée, ou Le Mariage de Figaro de Pierre Beaumarchais, cuenta la historia de enredos amorosos y conflictos sociales entre los sirvientes Figaro y Susanna y sus amos, el Conde y la Condesa Almaviva.'),
(78, 42, 'Item', 39, 0, 'Wolfgang Amadeus Mozart'),
(79, 42, 'Item', 40, 0, '1 de Mayo de 1786'),
(80, 42, 'Item', 37, 0, 'Lorenzo Da Ponte'),
(81, 42, 'Item', 47, 0, 'Dominio público'),
(82, 42, 'Item', 44, 0, 'Italiano'),
(83, 42, 'Item', 51, 0, 'Música'),
(84, 40, 'Item', 49, 0, 'Indie Rock'),
(85, 40, 'Item', 41, 0, '\"Creep\" es una canción melancólica y emocional que habla sobre la alienación, la inseguridad y el deseo de pertenecer. Es conocida por su poderosa interpretación vocal de Thom Yorke y la atmósfera sombría creada por los guitarras distorsionadas. Aunque inicialmente no fue un gran éxito, \"Creep\" se convirtió en un himno para muchos por su profunda resonancia emocional.'),
(86, 40, 'Item', 39, 0, 'Radiohead'),
(87, 40, 'Item', 48, 0, 'Pablo Honey'),
(88, 40, 'Item', 40, 0, '21 de Septiembre de 1992'),
(89, 40, 'Item', 37, 0, 'Thom Yorke'),
(90, 40, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de Radiohead'),
(91, 40, 'Item', 44, 0, 'Inglés'),
(92, 40, 'Item', 51, 0, 'Música'),
(93, 41, 'Item', 49, 0, 'Alternativa experimental'),
(94, 41, 'Item', 41, 0, '\"xanny\" es una canción de Billie Eilish que forma parte de su álbum WHEN WE ALL FALL ASLEEP, WHERE DO WE GO? de 2019. La canción trata sobre la presión social de consumir sustancias, como el alcohol y las drogas, para encajar. Billie canta sobre cómo rechaza ese estilo de vida, destacando la incomodidad y el vacío que sienten las personas que recurren a estas sustancias. Musicalmente, la canción tiene una atmósfera tranquila y melancólica, con un estilo vocal único de Billie, que se fusiona con una producción minimalista.'),
(95, 41, 'Item', 39, 0, 'Billie Eilish'),
(96, 41, 'Item', 48, 0, 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?'),
(97, 41, 'Item', 40, 0, '29 de Marzo de 2019'),
(98, 41, 'Item', 37, 0, 'Finneas O\'Connell'),
(99, 41, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de Darkroom y Interscope Records'),
(100, 41, 'Item', 44, 0, 'Inglés'),
(101, 41, 'Item', 51, 0, 'Música'),
(102, 19, 'Item', 49, 0, 'Reggaeton'),
(103, 19, 'Item', 41, 0, '\"La Inocente\" es una canción del artista puertorriqueño Mora, lanzada en 2020. En esta canción, Mora canta sobre una relación amorosa que parece estar basada en una inocencia y vulnerabilidad emocional, reflejando sentimientos de pasión, duda y amor no correspondido. La canción fusiona el reguetón con un toque melódico suave, lo que caracteriza el estilo único de Mora, que a menudo mezcla letras románticas con ritmos urbanos.'),
(104, 19, 'Item', 39, 0, 'Mora'),
(105, 19, 'Item', 39, 0, 'Feid'),
(106, 19, 'Item', 48, 0, 'Microdosis'),
(107, 19, 'Item', 40, 0, '1 de Abril de 2020'),
(108, 19, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de Warner Music'),
(109, 19, 'Item', 44, 0, 'Español'),
(110, 19, 'Item', 51, 0, 'Música'),
(111, 40, 'Item', 37, 0, 'Jonny Greenwood'),
(112, 40, 'Item', 37, 0, ' Ed O\'Brien'),
(113, 40, 'Item', 37, 0, 'Colin Greenwood'),
(114, 40, 'Item', 37, 0, 'Phil Selway'),
(115, 9, 'Item', 39, 0, 'John Denver'),
(116, 9, 'Item', 48, 0, 'Poems, Prayers & Promises'),
(117, 9, 'Item', 40, 0, '5 de Abril de 1971'),
(118, 9, 'Item', 37, 0, 'Bill Danoff y Taffy Nivert'),
(119, 9, 'Item', 49, 0, 'Country Tradicional'),
(120, 9, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de RCA Records'),
(121, 9, 'Item', 44, 0, 'Inglés'),
(122, 9, 'Item', 51, 0, 'Música'),
(123, 3, 'Item', 49, 0, 'Electrónica'),
(124, 3, 'Item', 41, 0, '\"Animals\" es una pista instrumental que se destaca por su potente drop y melodía pegajosa, convirtiéndose en un himno en festivales de música electrónica y consolidando la carrera de Martin Garrix a nivel internacional.'),
(125, 3, 'Item', 39, 0, 'Martijn Garristen'),
(126, 3, 'Item', 48, 0, 'EP Gold Skies'),
(127, 3, 'Item', 40, 0, '17 de Junio de 2013'),
(128, 3, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de Spinnin\' Records'),
(129, 3, 'Item', 44, 0, 'Sin letra'),
(130, 3, 'Item', 51, 0, 'Música'),
(131, 45, 'Item', 49, 0, 'Flamenco'),
(132, 45, 'Item', 41, 0, '\"Malamente\" fusiona elementos del flamenco tradicional con sonidos urbanos y pop, destacando por su innovadora producción y la potente interpretación vocal de Rosalía. La canción aborda temas de presagios y presentimientos en una relación amorosa.'),
(133, 45, 'Item', 39, 0, 'Rosalía Vila'),
(134, 45, 'Item', 48, 0, 'El mal querer'),
(135, 45, 'Item', 40, 0, '30 de Mayo de 2018'),
(136, 45, 'Item', 37, 0, 'Pablo Díaz-Reixa'),
(137, 45, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de Columbia Records'),
(138, 45, 'Item', 42, 0, 'Música'),
(139, 45, 'Item', 44, 0, 'Español'),
(140, 11, 'Item', 49, 0, 'Pop Rock'),
(141, 11, 'Item', 41, 0, '\"Yellow\" es una balada que combina melodías melancólicas con letras que expresan devoción y admiración profunda.\r\nLa canción utiliza el color amarillo como metáfora de calidez, felicidad y luminosidad.\r\nHa sido interpretada como una expresión de amor incondicional y ha resonado con muchos oyentes por su emotividad y sencillez.'),
(142, 11, 'Item', 39, 0, 'Chris Martin'),
(143, 11, 'Item', 39, 0, 'Jonny Bucklard'),
(144, 11, 'Item', 39, 0, 'Guy Berryman'),
(145, 11, 'Item', 39, 0, 'Will Champion'),
(146, 11, 'Item', 48, 0, 'Parachutes'),
(147, 11, 'Item', 40, 0, '26 de Junio de 2000'),
(148, 11, 'Item', 37, 0, 'Ken Nelson'),
(149, 11, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de Parlophone'),
(150, 11, 'Item', 42, 0, 'Música'),
(151, 11, 'Item', 44, 0, 'Inglés'),
(152, 4, 'Item', 49, 0, 'Pop Alternativo'),
(153, 4, 'Item', 41, 0, '\"Bad Romance\" es una canción de pop electrónico con influencias dance y elementos góticos, conocida por su pegajoso estribillo y su icónico videoclip.'),
(154, 4, 'Item', 39, 0, 'Lady Gaga'),
(155, 4, 'Item', 39, 0, 'Nadir Khayat'),
(156, 4, 'Item', 48, 0, 'The Fame Monster'),
(157, 4, 'Item', 40, 0, '23 de Octubre de 2009'),
(158, 4, 'Item', 37, 0, 'RedOne'),
(159, 4, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de Interscope Records y Streamline Records'),
(160, 4, 'Item', 42, 0, 'Música'),
(161, 4, 'Item', 44, 0, 'Inglés'),
(162, 7, 'Item', 49, 0, 'Rock Clásico'),
(163, 7, 'Item', 41, 0, '\"Back In Black\" es una de las canciones más icónicas de AC/DC, con una potente combinación de riffs de guitarra y una energía que rinde homenaje al fallecido vocalista Bon Scott.'),
(164, 7, 'Item', 39, 0, 'Angus Young'),
(165, 7, 'Item', 39, 0, 'Malcolm Young'),
(166, 7, 'Item', 39, 0, 'Brian Johnson'),
(167, 7, 'Item', 48, 0, 'Back In Black'),
(168, 7, 'Item', 40, 0, '25 de Julio de 1980'),
(169, 7, 'Item', 37, 0, 'Robert John \"Mutt\" Lange'),
(170, 7, 'Item', 47, 0, 'Bajo derechos de autor, propiedad de Albert Productions y Atlantic Records'),
(171, 7, 'Item', 42, 0, 'Música'),
(172, 7, 'Item', 44, 0, 'Inglés'),
(173, 10, 'Collection', 42, 0, 'Música'),
(174, 10, 'Collection', 41, 0, 'Música tradicional que representa la identidad cultural y las raíces de un pueblo o región. Se caracteriza por instrumentos autóctonos, letras que narran historias locales y ritmos típicos de cada comunidad.'),
(175, 6, 'Collection', 41, 0, 'Género nacido en Estados Unidos a finales del siglo XIX. Destaca por su improvisación, complejidad armónica y ritmos sincopados. Utiliza instrumentos como el saxofón, la trompeta y el piano.'),
(176, 2, 'Collection', 41, 0, 'Música popular con melodías pegajosas y estructuras sencillas, diseñada para un público amplio. Tiende a incorporar elementos de otros géneros y prioriza la accesibilidad y el entretenimiento.'),
(177, 1, 'Collection', 41, 0, 'Género derivado del rock and roll, caracterizado por guitarras eléctricas, ritmos fuertes y letras que suelen expresar rebeldía o emociones intensas. Tiene múltiples subgéneros como hard rock, punk y grunge.'),
(178, 7, 'Collection', 41, 0, 'Música formal y académica que abarca desde el período barroco hasta el contemporáneo. Suele interpretarse con orquestas y se centra en la composición estructurada y expresiva.'),
(179, 3, 'Collection', 41, 0, 'Género que agrupa estilos como el reguetón, rap, trap y hip-hop. Suelen tener ritmos pegajosos, letras narrativas y temáticas urbanas con influencia de la vida callejera y el movimiento cultural.'),
(180, 8, 'Collection', 41, 0, 'Música creada principalmente con sintetizadores y equipos digitales. Es común en clubes y festivales, con subgéneros como house, techno, trance y dubstep.'),
(181, 4, 'Collection', 41, 0, 'Nacido en el sur de Estados Unidos, se caracteriza por el uso de guitarras acústicas, banjos y letras que cuentan historias de la vida rural, el amor y los valores tradicionales.'),
(182, 9, 'Collection', 41, 0, 'Género amplio que abarca música fuera de las corrientes comerciales tradicionales. Suelen destacar por la experimentación y la fusión de estilos, con una actitud independiente o contracultural.'),
(183, 5, 'Collection', 41, 0, 'Género caracterizado por su sonido fuerte y pesado, con guitarras eléctricas distorsionadas, baterías rápidas y potentes, y voces intensas. A menudo aborda temas oscuros, filosóficos o sociales. Se divide en subgéneros como heavy metal, thrash metal, death metal y black metal, entre otros, cada uno con características particulares en cuanto a ritmo, velocidad y técnica.'),
(184, 11, 'Collection', 50, 0, 'Contactos'),
(185, 11, 'Collection', 41, 0, '¿Tienes alguna pregunta o necesitas más información? Estamos aquí para ayudarte. En nuestra sección de contacto, puedes ponerte en comunicación con nuestro equipo para resolver cualquier duda, enviar comentarios o solicitar soporte. Nos aseguraremos de responderte lo más rápido posible. ¡Tu opinión es muy importante para nosotros!'),
(186, 46, 'Item', 39, 0, 'Abel Martínez Molina: abelmartinezmolina5@gmail.com'),
(187, 46, 'Item', 39, 0, 'Jose Antonio Díaz Soriano: jose.antonio.diaz.soriano@gmail.com'),
(188, 46, 'Item', 39, 0, 'Javier Nerja Aguilar: javierner2005@gmail.com'),
(189, 46, 'Item', 50, 0, 'Equipo de soporte'),
(190, 46, 'Item', 41, 0, 'Gmail de contacto de cada miembro del equipo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_files`
--

CREATE TABLE `omeka_files` (
  `id` int(10) UNSIGNED NOT NULL,
  `item_id` int(10) UNSIGNED NOT NULL,
  `order` int(10) UNSIGNED DEFAULT NULL,
  `size` bigint(20) UNSIGNED NOT NULL,
  `has_derivative_image` tinyint(1) NOT NULL,
  `authentication` char(32) DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `type_os` varchar(255) DEFAULT NULL,
  `filename` text NOT NULL,
  `original_filename` text NOT NULL,
  `modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `added` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `stored` tinyint(1) NOT NULL DEFAULT 0,
  `metadata` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_files`
--

INSERT INTO `omeka_files` (`id`, `item_id`, `order`, `size`, `has_derivative_image`, `authentication`, `mime_type`, `type_os`, `filename`, `original_filename`, `modified`, `added`, `stored`, `metadata`) VALUES
(1, 42, NULL, 91592, 1, 'a3bbac4d27a8469cf3e6b9e73c02d942', 'image/jpeg', '', '16b6bbcf0648775d66c33ecb2cd0485e.jpg', 'Wolfgang-amadeus-mozart_1.jpg', '2024-12-21 14:55:31', '2024-12-13 15:36:47', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":640,\"resolution_y\":820,\"compression_ratio\":0.05817581300813008}}'),
(2, 41, NULL, 35196, 1, '7018122e87d13f4709aa17f58f03c202', 'image/jpeg', '', 'd881bd2a6d3c9f9e3503b4a5822fdfef.jpg', 'artworks-000669707644-l5kt4j-t500x500.jpg', '2024-12-21 14:56:55', '2024-12-20 14:44:11', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":500,\"resolution_y\":500,\"compression_ratio\":0.046928}}'),
(3, 4, NULL, 74558, 1, 'ff62962eb780e0c4adc1fd77b9b8f4de', 'image/jpeg', '', '8d2e1fa3e400a538442930cfe9c47e8b.jpg', 'ab67616d0000b2735c9890c0456a3719eeecd8aa.jpg', '2024-12-21 15:15:13', '2024-12-20 14:45:14', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":640,\"resolution_y\":640,\"compression_ratio\":0.06067545572916667}}'),
(4, 11, NULL, 97460, 1, '8e571da989d0761b93f294dc141d29eb', 'image/jpeg', '', 'f45fab1f577b31e11766570e1c67d766.jpg', 'artworks-pS5yLKBKh2ZFgJ81-ppqlcw-t1080x1080.jpg', '2024-12-21 15:08:25', '2024-12-20 14:46:13', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":1080,\"resolution_y\":1080,\"compression_ratio\":0.027852080475537267}}'),
(5, 19, NULL, 84935, 1, '74b25e91b56296435d308aafc8602f3b', 'image/jpeg', '', '97e7910ef34c992ab9b3d7a757206533.jpeg', 'WhatsApp Image 2024-12-20 at 15.43.34.jpeg', '2024-12-21 15:07:48', '2024-12-20 14:47:19', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":500,\"resolution_y\":500,\"compression_ratio\":0.11324666666666666}}'),
(6, 7, NULL, 38887, 1, 'bae0409eb3a226f00b4612792f649d7a', 'image/jpeg', '', '19a5fb14eabe5b7ce1f34ce1c0679096.jpeg', 'WhatsApp Image 2024-12-20 at 15.44.58.jpeg', '2024-12-21 15:14:27', '2024-12-20 14:47:50', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":810,\"resolution_y\":810,\"compression_ratio\":0.019756642788192856}}'),
(7, 9, NULL, 157470, 1, '62928a8468ce9cf1e149e16e3184d8bf', 'image/jpeg', '', 'a6f340c86f85be30d49dca32199434b1.jpeg', 'WhatsApp Image 2024-12-20 at 15.45.17.jpeg', '2024-12-21 15:11:28', '2024-12-20 14:48:18', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":640,\"resolution_y\":640,\"compression_ratio\":0.1281494140625}}'),
(8, 3, NULL, 109206, 1, '1e0814e1c4ad543db0fd87fe8b4ea105', 'image/jpeg', '', '2eed4bb58263b162dadaf6e429303ae4.jpeg', 'WhatsApp Image 2024-12-20 at 15.45.46.jpeg', '2024-12-21 15:16:43', '2024-12-20 14:48:41', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":640,\"resolution_y\":640,\"compression_ratio\":0.0888720703125}}'),
(9, 45, NULL, 100358, 1, '1a5a29058001f6e1a42e2411dfe7ca35', 'image/jpeg', '', 'b61be42497b2e5d659cb53b6e0248d0b.jpeg', 'WhatsApp Image 2024-12-20 at 15.46.19.jpeg', '2024-12-21 14:52:51', '2024-12-20 14:49:02', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":640,\"resolution_y\":640,\"compression_ratio\":0.08167154947916666}}'),
(10, 40, NULL, 186082, 1, 'f2643f1230f01cd1cc8654190d2b0e04', 'image/jpeg', '', 'df0c7057f55fc1118799deaffed5c0a0.jpg', 'ab67616d0000b273df55e326ed144ab4f5cecf95.jpg', '2024-12-21 15:06:41', '2024-12-20 14:50:00', 1, '{\"mime_type\":\"image\\/jpeg\",\"video\":{\"dataformat\":\"jpg\",\"lossless\":false,\"bits_per_sample\":24,\"pixel_aspect_ratio\":1,\"resolution_x\":640,\"resolution_y\":640,\"compression_ratio\":0.15143391927083333}}'),
(11, 46, NULL, 21438, 1, '8d0f87c9036bcd577395a4540d03c499', 'image/png', '', '47d20d15de9121976a569c0df4c8e63a.png', '73552.png', '2024-12-21 14:02:24', '2024-12-20 15:28:24', 1, '{\"mime_type\":\"image\\/png\",\"video\":{\"dataformat\":\"png\",\"lossless\":false,\"resolution_x\":512,\"resolution_y\":512,\"bits_per_sample\":32,\"compression_ratio\":0.020444869995117188},\"comments\":{\"Software\":[\"www.inkscape.org\"]},\"comments_html\":{\"Software\":[\"www.inkscape.org\"]}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_items`
--

CREATE TABLE `omeka_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `item_type_id` int(10) UNSIGNED DEFAULT NULL,
  `collection_id` int(10) UNSIGNED DEFAULT NULL,
  `featured` tinyint(4) NOT NULL,
  `public` tinyint(4) NOT NULL,
  `modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `added` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `owner_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_items`
--

INSERT INTO `omeka_items` (`id`, `item_type_id`, `collection_id`, `featured`, `public`, `modified`, `added`, `owner_id`) VALUES
(1, NULL, 3, 0, 0, '2024-12-13 14:22:35', '2024-12-11 11:30:18', 1),
(2, NULL, 4, 0, 0, '2024-12-13 14:49:35', '2024-12-11 11:35:08', 1),
(3, NULL, 8, 0, 1, '2024-12-21 15:16:43', '2024-12-11 11:36:20', 1),
(4, NULL, 2, 0, 1, '2024-12-21 15:15:13', '2024-12-11 11:37:33', 1),
(5, NULL, 7, 0, 0, '2024-12-13 15:00:34', '2024-12-11 11:39:45', 1),
(6, NULL, 2, 0, 0, '2024-12-13 14:58:54', '2024-12-11 11:42:27', 1),
(7, NULL, 1, 0, 1, '2024-12-21 15:14:27', '2024-12-11 11:46:08', 1),
(8, NULL, NULL, 0, 0, '2024-12-13 14:57:50', '2024-12-11 11:46:19', 1),
(9, NULL, 4, 0, 1, '2024-12-21 15:11:28', '2024-12-11 11:46:42', 1),
(10, NULL, NULL, 0, 0, '2024-12-13 14:55:02', '2024-12-11 11:46:56', 1),
(11, NULL, 2, 0, 1, '2024-12-21 15:08:25', '2024-12-11 11:47:02', 1),
(12, NULL, NULL, 0, 0, '2024-12-13 14:51:25', '2024-12-11 11:47:11', 1),
(13, NULL, NULL, 0, 0, '2024-12-11 11:47:18', '2024-12-11 11:47:18', 1),
(14, NULL, NULL, 0, 0, '2024-12-11 11:47:24', '2024-12-11 11:47:24', 1),
(15, NULL, NULL, 0, 0, '2024-12-11 11:47:31', '2024-12-11 11:47:31', 1),
(16, NULL, NULL, 0, 0, '2024-12-13 15:14:31', '2024-12-11 11:47:46', 1),
(17, NULL, NULL, 0, 0, '2024-12-11 11:47:57', '2024-12-11 11:47:57', 1),
(19, NULL, NULL, 0, 1, '2024-12-21 15:07:48', '2024-12-11 11:48:24', 1),
(20, NULL, 3, 0, 0, '2024-12-13 14:20:53', '2024-12-11 11:48:30', 1),
(21, NULL, NULL, 0, 0, '2024-12-11 11:48:52', '2024-12-11 11:48:52', 1),
(22, NULL, NULL, 0, 0, '2024-12-11 11:49:01', '2024-12-11 11:49:01', 1),
(23, NULL, NULL, 0, 0, '2024-12-11 11:49:42', '2024-12-11 11:49:42', 1),
(24, NULL, NULL, 0, 0, '2024-12-13 15:11:45', '2024-12-11 11:49:59', 1),
(25, NULL, NULL, 0, 0, '2024-12-11 11:50:22', '2024-12-11 11:50:22', 1),
(26, NULL, NULL, 0, 0, '2024-12-11 11:50:41', '2024-12-11 11:50:41', 1),
(27, NULL, NULL, 0, 0, '2024-12-11 11:50:56', '2024-12-11 11:50:56', 1),
(28, NULL, NULL, 0, 0, '2024-12-11 11:51:11', '2024-12-11 11:51:11', 1),
(29, NULL, NULL, 0, 0, '2024-12-11 11:51:24', '2024-12-11 11:51:24', 1),
(30, NULL, NULL, 0, 0, '2024-12-11 11:51:54', '2024-12-11 11:51:54', 1),
(31, NULL, NULL, 0, 0, '2024-12-11 11:52:06', '2024-12-11 11:52:06', 1),
(32, NULL, NULL, 0, 0, '2024-12-11 11:52:19', '2024-12-11 11:52:19', 1),
(33, NULL, NULL, 0, 0, '2024-12-11 11:52:29', '2024-12-11 11:52:29', 1),
(34, NULL, 6, 0, 0, '2024-12-13 14:27:39', '2024-12-13 14:26:28', 1),
(35, NULL, 6, 0, 0, '2024-12-13 14:29:11', '2024-12-13 14:29:11', 1),
(36, NULL, 8, 0, 0, '2024-12-13 15:03:41', '2024-12-13 14:31:00', 1),
(37, NULL, 8, 0, 0, '2024-12-13 15:01:34', '2024-12-13 14:31:32', 1),
(38, NULL, 8, 0, 0, '2024-12-13 15:04:23', '2024-12-13 14:32:10', 1),
(39, NULL, 9, 0, 0, '2024-12-13 15:05:33', '2024-12-13 14:32:39', 1),
(40, NULL, 9, 0, 1, '2024-12-21 15:06:41', '2024-12-13 14:34:21', 1),
(41, NULL, 9, 0, 1, '2024-12-21 14:56:55', '2024-12-13 14:34:59', 1),
(42, NULL, 7, 0, 1, '2024-12-21 14:55:31', '2024-12-13 14:36:49', 1),
(43, NULL, 7, 0, 0, '2024-12-13 15:07:21', '2024-12-13 14:38:05', 1),
(44, NULL, 10, 0, 0, '2024-12-13 14:43:07', '2024-12-13 14:39:13', 1),
(45, NULL, 10, 0, 1, '2024-12-21 14:52:51', '2024-12-13 15:10:32', 1),
(46, NULL, 11, 0, 1, '2024-12-21 14:02:24', '2024-12-20 15:28:24', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_item_types`
--

CREATE TABLE `omeka_item_types` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_item_types`
--

INSERT INTO `omeka_item_types` (`id`, `name`, `description`) VALUES
(1, 'Text', 'A resource consisting primarily of words for reading. Examples include books, letters, dissertations, poems, newspapers, articles, archives of mailing lists. Note that facsimiles or images of texts are still of the genre Text.'),
(3, 'Moving Image', 'A series of visual representations imparting an impression of motion when shown in succession. Examples include animations, movies, television programs, videos, zoetropes, or visual output from a simulation.'),
(4, 'Oral History', 'A resource containing historical information obtained in interviews with persons having firsthand knowledge.'),
(5, 'Sound', 'A resource primarily intended to be heard. Examples include a music playback file format, an audio compact disc, and recorded speech or sounds.'),
(6, 'Still Image', 'A static visual representation. Examples include paintings, drawings, graphic designs, plans and maps. Recommended best practice is to assign the type Text to images of textual materials.'),
(7, 'Website', 'A resource comprising of a web page or web pages and all related assets ( such as images, sound and video files, etc. ).'),
(8, 'Event', 'A non-persistent, time-based occurrence. Metadata for an event provides descriptive information that is the basis for discovery of the purpose, location, duration, and responsible agents associated with an event. Examples include an exhibition, webcast, conference, workshop, open day, performance, battle, trial, wedding, tea party, conflagration.'),
(9, 'Email', 'A resource containing textual messages and binary attachments sent electronically from one person to another or one person to many people.'),
(10, 'Lesson Plan', 'A resource that gives a detailed description of a course of instruction.'),
(11, 'Hyperlink', 'A link, or reference, to another resource on the Internet.'),
(12, 'Person', 'An individual.'),
(13, 'Interactive Resource', 'A resource requiring interaction from the user to be understood, executed, or experienced. Examples include forms on Web pages, applets, multimedia learning objects, chat services, or virtual reality environments.'),
(14, 'Dataset', 'Data encoded in a defined structure. Examples include lists, tables, and databases. A dataset may be useful for direct machine processing.'),
(15, 'Physical Object', 'An inanimate, three-dimensional object or substance. Note that digital representations of, or surrogates for, these objects should use Moving Image, Still Image, Text or one of the other types.'),
(16, 'Service', 'A system that provides one or more functions. Examples include a photocopying service, a banking service, an authentication service, interlibrary loans, a Z39.50 or Web server.'),
(17, 'Software', 'A computer program in source or compiled form. Examples include a C source file, MS-Windows .exe executable, or Perl script.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_item_types_elements`
--

CREATE TABLE `omeka_item_types_elements` (
  `id` int(10) UNSIGNED NOT NULL,
  `item_type_id` int(10) UNSIGNED NOT NULL,
  `element_id` int(10) UNSIGNED NOT NULL,
  `order` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_item_types_elements`
--

INSERT INTO `omeka_item_types_elements` (`id`, `item_type_id`, `element_id`, `order`) VALUES
(1, 1, 7, NULL),
(2, 1, 1, NULL),
(3, 6, 7, NULL),
(6, 6, 10, NULL),
(7, 3, 7, NULL),
(8, 3, 11, NULL),
(9, 3, 12, NULL),
(10, 3, 13, NULL),
(11, 3, 14, NULL),
(12, 3, 5, NULL),
(13, 5, 7, NULL),
(14, 5, 11, NULL),
(15, 5, 15, NULL),
(16, 5, 5, NULL),
(17, 4, 7, NULL),
(18, 4, 11, NULL),
(19, 4, 15, NULL),
(20, 4, 5, NULL),
(21, 4, 2, NULL),
(22, 4, 3, NULL),
(23, 4, 4, NULL),
(24, 4, 16, NULL),
(25, 9, 17, NULL),
(26, 9, 18, NULL),
(27, 9, 20, NULL),
(28, 9, 19, NULL),
(29, 9, 21, NULL),
(30, 9, 22, NULL),
(31, 9, 23, NULL),
(32, 10, 24, NULL),
(33, 10, 25, NULL),
(34, 10, 26, NULL),
(35, 10, 11, NULL),
(36, 10, 27, NULL),
(37, 7, 6, NULL),
(38, 11, 28, NULL),
(39, 8, 29, NULL),
(40, 8, 30, NULL),
(41, 8, 11, NULL),
(42, 12, 31, NULL),
(43, 12, 32, NULL),
(44, 12, 33, NULL),
(45, 12, 34, NULL),
(46, 12, 35, NULL),
(47, 12, 36, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_keys`
--

CREATE TABLE `omeka_keys` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `label` varchar(100) NOT NULL,
  `key` char(40) NOT NULL,
  `ip` varbinary(16) DEFAULT NULL,
  `accessed` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_options`
--

CREATE TABLE `omeka_options` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_options`
--

INSERT INTO `omeka_options` (`id`, `name`, `value`) VALUES
(1, 'omeka_version', '3.1.2'),
(7, 'thumbnail_constraint', '200'),
(8, 'square_thumbnail_constraint', '200'),
(9, 'fullsize_constraint', '800'),
(10, 'per_page_admin', '10'),
(11, 'per_page_public', '10'),
(12, 'show_empty_elements', '0'),
(13, 'path_to_convert', ''),
(14, 'admin_theme', 'default'),
(16, 'file_extension_whitelist', 'aac,aif,aiff,asf,asx,avi,bmp,c,cc,class,css,divx,doc,docx,exe,gif,gz,gzip,h,ico,j2k,jp2,jpe,jpeg,jpg,m4a,m4v,mdb,mid,midi,mov,mp2,mp3,mp4,mpa,mpe,mpeg,mpg,mpp,odb,odc,odf,odg,odp,ods,odt,ogg,opus,pdf,png,pot,pps,ppt,pptx,qt,ra,ram,rtf,rtx,swf,tar,tif,tiff,txt,wav,wax,webm,wma,wmv,wmx,wri,xla,xls,xlsx,xlt,xlw,zip'),
(17, 'file_mime_type_whitelist', 'application/msword,application/ogg,application/pdf,application/rtf,application/vnd.ms-access,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.ms-project,application/vnd.ms-write,application/vnd.oasis.opendocument.chart,application/vnd.oasis.opendocument.database,application/vnd.oasis.opendocument.formula,application/vnd.oasis.opendocument.graphics,application/vnd.oasis.opendocument.presentation,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.text,application/x-ms-wmp,application/x-ogg,application/x-gzip,application/x-msdownload,application/x-shockwave-flash,application/x-tar,application/zip,audio/aac,audio/aiff,audio/mid,audio/midi,audio/mp3,audio/mp4,audio/mpeg,audio/mpeg3,audio/ogg,audio/wav,audio/wma,audio/x-aac,audio/x-aiff,audio/x-m4a,audio/x-midi,audio/x-mp3,audio/x-mp4,audio/x-mpeg,audio/x-mpeg3,audio/x-mpegaudio,audio/x-ms-wax,audio/x-realaudio,audio/x-wav,audio/x-wma,image/bmp,image/gif,image/icon,image/jpeg,image/pjpeg,image/png,image/tiff,image/x-icon,image/x-ms-bmp,text/css,text/plain,text/richtext,text/rtf,video/asf,video/avi,video/divx,video/mp4,video/mpeg,video/msvideo,video/ogg,video/quicktime,video/webm,video/x-m4v,video/x-ms-wmv,video/x-msvideo'),
(18, 'disable_default_file_validation', ''),
(20, 'display_system_info', '1'),
(21, 'html_purifier_is_enabled', '1'),
(22, 'html_purifier_allowed_html_elements', 'p,br,strong,em,span,div,ul,ol,li,a,h1,h2,h3,h4,h5,h6,address,pre,table,tr,td,blockquote,thead,tfoot,tbody,th,dl,dt,dd,q,small,strike,sup,sub,b,i,big,small,tt'),
(23, 'html_purifier_allowed_html_attributes', '*.style,*.class,a.href,a.title,a.target'),
(26, 'search_record_types', 'a:3:{s:4:\"Item\";s:4:\"Item\";s:4:\"File\";s:4:\"File\";s:10:\"Collection\";s:10:\"Collection\";}'),
(27, 'api_enable', ''),
(28, 'api_per_page', '50'),
(29, 'show_element_set_headings', '1'),
(30, 'use_square_thumbnail', '1'),
(33, 'public_theme', 'minimalist'),
(38, 'theme_minimalist_options', 'a:11:{s:21:\"display_featured_item\";s:1:\"1\";s:27:\"display_featured_collection\";s:1:\"1\";s:24:\"display_featured_exhibit\";s:1:\"1\";s:21:\"homepage_recent_items\";s:0:\"\";s:13:\"homepage_text\";s:0:\"\";s:11:\"footer_text\";s:29:\"Colección digital de música\";s:24:\"display_footer_copyright\";s:1:\"0\";s:17:\"item_file_gallery\";s:1:\"0\";s:19:\"use_advanced_search\";s:1:\"0\";s:12:\"exhibits_nav\";s:4:\"full\";s:4:\"logo\";s:36:\"455539a2ea8c3730e6f22ac4ee50490a.jpg\";}'),
(41, 'site_title', 'Colección digital de música'),
(42, 'description', 'Bienvenidos a esta plataforma única que alberga una vasta colección digital de música, donde los amantes de todos los géneros pueden explorar y disfrutar de una selección curada de álbumes, canciones y grabaciones históricas. Nuestra misión es ofrecer acceso a una experiencia musical diversa y enriquecedora, con metadatos detallados, biografías de artistas y archivos sonoros de alta calidad. Ya sea que busques clásicos atemporales o los últimos lanzamientos, en [Nombre del sitio] encontrarás lo que necesitas, con opciones para escuchar, explorar y descubrir nuevas joyas musicales. Disfruta de la música en su forma más accesible, con herramientas fáciles de usar para crear listas de reproducción personalizadas y compartir tus canciones favoritas con otros.'),
(43, 'administrator_email', 'javierner2005@gmail.com'),
(44, 'copyright', ''),
(45, 'author', ''),
(46, 'tag_delimiter', ','),
(48, 'omeka_update', 'a:2:{s:14:\"latest_version\";s:6:\"3.1.2\n\";s:12:\"last_updated\";i:1734793707;}'),
(71, 'public_navigation_main', '[{\"uid\":\"\\/omeka\\/items\\/browse\",\"can_delete\":false,\"type\":\"Omeka_Navigation_Page_Uri\",\"label\":\"Navegar por los elementos\",\"fragment\":null,\"id\":null,\"class\":null,\"title\":null,\"target\":null,\"accesskey\":null,\"rel\":[],\"rev\":[],\"customHtmlAttribs\":[],\"order\":1,\"resource\":null,\"privilege\":null,\"active\":false,\"visible\":true,\"pages\":[],\"uri\":\"\\/omeka\\/items\\/browse\"},{\"uid\":\"\\/omeka\\/collections\\/browse\",\"can_delete\":false,\"type\":\"Omeka_Navigation_Page_Uri\",\"label\":\"Navegar por las colecciones\",\"fragment\":null,\"id\":null,\"class\":null,\"title\":null,\"target\":null,\"accesskey\":null,\"rel\":[],\"rev\":[],\"customHtmlAttribs\":[],\"order\":2,\"resource\":null,\"privilege\":null,\"active\":false,\"visible\":true,\"pages\":[],\"uri\":\"\\/omeka\\/collections\\/browse\"},{\"uid\":\"\\/omeka\\/noticias\",\"can_delete\":false,\"type\":\"Omeka_Navigation_Page_Uri\",\"label\":\"Noticias\",\"fragment\":null,\"id\":null,\"class\":null,\"title\":null,\"target\":null,\"accesskey\":null,\"rel\":[],\"rev\":[],\"customHtmlAttribs\":[],\"order\":3,\"resource\":null,\"privilege\":null,\"active\":false,\"visible\":true,\"pages\":[{\"uid\":\"\\/omeka\\/que-es-buenas-noches-el-nuevo-album--de-quevedo\",\"can_delete\":false,\"type\":\"Omeka_Navigation_Page_Uri\",\"label\":\"\\u00bfQu\\u00e9 es \\u201cBuenas Noches\\u201d, el nuevo \\u00e1lbum  de Quevedo?\",\"fragment\":null,\"id\":null,\"class\":null,\"title\":null,\"target\":null,\"accesskey\":null,\"rel\":[],\"rev\":[],\"customHtmlAttribs\":[],\"order\":4,\"resource\":null,\"privilege\":null,\"active\":false,\"visible\":true,\"pages\":[],\"uri\":\"\\/omeka\\/que-es-buenas-noches-el-nuevo-album--de-quevedo\"},{\"uid\":\"\\/omeka\\/lady-gaga-lanza-bad-romance-y-redefine-la-musica-pop\",\"can_delete\":false,\"type\":\"Omeka_Navigation_Page_Uri\",\"label\":\"Lady Gaga lanza \\u201cBad Romance\\u201d y redefine la m\\u00fasica pop\",\"fragment\":null,\"id\":null,\"class\":null,\"title\":null,\"target\":null,\"accesskey\":null,\"rel\":[],\"rev\":[],\"customHtmlAttribs\":[],\"order\":5,\"resource\":null,\"privilege\":null,\"active\":false,\"visible\":true,\"pages\":[],\"uri\":\"\\/omeka\\/lady-gaga-lanza-bad-romance-y-redefine-la-musica-pop\"},{\"uid\":\"\\/omeka\\/this-old-dog-el-iconico-album-de-mac-demarco\",\"can_delete\":false,\"type\":\"Omeka_Navigation_Page_Uri\",\"label\":\"This Old Dog, el ic\\u00f3nico \\u00e1lbum de Mac DeMarco\",\"fragment\":null,\"id\":null,\"class\":null,\"title\":null,\"target\":null,\"accesskey\":null,\"rel\":[],\"rev\":[],\"customHtmlAttribs\":[],\"order\":6,\"resource\":null,\"privilege\":null,\"active\":false,\"visible\":true,\"pages\":[],\"uri\":\"\\/omeka\\/this-old-dog-el-iconico-album-de-mac-demarco\"}],\"uri\":\"\\/omeka\\/noticias\"}]'),
(72, 'homepage_uri', '/omeka/collections/browse');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_plugins`
--

CREATE TABLE `omeka_plugins` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `version` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_plugins`
--

INSERT INTO `omeka_plugins` (`id`, `name`, `active`, `version`) VALUES
(1, 'SimplePages', 1, '3.2.1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_processes`
--

CREATE TABLE `omeka_processes` (
  `id` int(10) UNSIGNED NOT NULL,
  `class` varchar(255) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `pid` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('starting','in progress','completed','paused','error','stopped') NOT NULL,
  `args` text NOT NULL,
  `started` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `stopped` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_records_tags`
--

CREATE TABLE `omeka_records_tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `record_id` int(10) UNSIGNED NOT NULL,
  `record_type` varchar(50) NOT NULL DEFAULT '',
  `tag_id` int(10) UNSIGNED NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_records_tags`
--

INSERT INTO `omeka_records_tags` (`id`, `record_id`, `record_type`, `tag_id`, `time`) VALUES
(1, 1, 'Item', 1, '2024-12-11 11:32:25'),
(2, 2, 'Item', 2, '2024-12-11 11:35:08'),
(3, 2, 'Item', 3, '2024-12-11 11:35:08'),
(4, 3, 'Item', 4, '2024-12-11 11:36:20'),
(5, 3, 'Item', 5, '2024-12-11 11:36:20'),
(6, 4, 'Item', 4, '2024-12-11 11:37:33'),
(7, 4, 'Item', 6, '2024-12-11 11:37:33'),
(8, 5, 'Item', 7, '2024-12-11 11:39:45'),
(9, 6, 'Item', 4, '2024-12-11 11:42:27'),
(10, 6, 'Item', 8, '2024-12-11 11:42:27'),
(11, 34, 'Item', 9, '2024-12-13 14:26:28'),
(12, 34, 'Item', 10, '2024-12-13 14:27:39'),
(13, 35, 'Item', 9, '2024-12-13 14:29:11'),
(14, 35, 'Item', 11, '2024-12-13 14:29:11'),
(15, 36, 'Item', 12, '2024-12-13 14:31:00'),
(16, 36, 'Item', 13, '2024-12-13 14:31:00'),
(17, 37, 'Item', 12, '2024-12-13 14:31:32'),
(18, 37, 'Item', 14, '2024-12-13 14:31:32'),
(19, 38, 'Item', 12, '2024-12-13 14:32:10'),
(20, 38, 'Item', 15, '2024-12-13 14:32:10'),
(21, 39, 'Item', 16, '2024-12-13 14:32:39'),
(22, 39, 'Item', 17, '2024-12-13 14:32:39'),
(23, 40, 'Item', 16, '2024-12-13 14:34:21'),
(24, 40, 'Item', 18, '2024-12-13 14:34:21'),
(25, 41, 'Item', 16, '2024-12-13 14:34:59'),
(26, 41, 'Item', 19, '2024-12-13 14:34:59'),
(27, 42, 'Item', 7, '2024-12-13 14:36:49'),
(28, 42, 'Item', 20, '2024-12-13 14:36:49'),
(29, 43, 'Item', 7, '2024-12-13 14:38:06'),
(30, 43, 'Item', 21, '2024-12-13 14:38:06'),
(31, 44, 'Item', 22, '2024-12-13 14:39:13'),
(32, 44, 'Item', 23, '2024-12-13 14:39:13'),
(33, 4, 'Item', 24, '2024-12-13 14:48:03'),
(34, 3, 'Item', 25, '2024-12-13 14:48:36'),
(35, 2, 'Item', 26, '2024-12-13 14:49:35'),
(36, 12, 'Item', 27, '2024-12-13 14:51:25'),
(37, 12, 'Item', 1, '2024-12-13 14:51:25'),
(38, 11, 'Item', 28, '2024-12-13 14:53:03'),
(39, 10, 'Item', 29, '2024-12-13 14:55:02'),
(40, 10, 'Item', 1, '2024-12-13 14:55:02'),
(41, 9, 'Item', 30, '2024-12-13 14:56:05'),
(42, 9, 'Item', 2, '2024-12-13 14:56:05'),
(43, 8, 'Item', 31, '2024-12-13 14:57:50'),
(44, 7, 'Item', 32, '2024-12-13 14:58:25'),
(45, 7, 'Item', 33, '2024-12-13 14:58:25'),
(46, 6, 'Item', 29, '2024-12-13 14:58:54'),
(47, 5, 'Item', 34, '2024-12-13 15:00:34'),
(48, 36, 'Item', 35, '2024-12-13 15:01:20'),
(49, 37, 'Item', 36, '2024-12-13 15:01:34'),
(50, 38, 'Item', 37, '2024-12-13 15:01:52'),
(51, 39, 'Item', 38, '2024-12-13 15:02:02'),
(52, 40, 'Item', 39, '2024-12-13 15:02:20'),
(53, 41, 'Item', 35, '2024-12-13 15:03:06'),
(54, 41, 'Item', 40, '2024-12-13 15:03:06'),
(55, 36, 'Item', 41, '2024-12-13 15:03:41'),
(56, 38, 'Item', 42, '2024-12-13 15:04:23'),
(57, 39, 'Item', 43, '2024-12-13 15:05:33'),
(58, 40, 'Item', 44, '2024-12-13 15:05:49'),
(59, 43, 'Item', 45, '2024-12-13 15:07:21'),
(60, 42, 'Item', 46, '2024-12-13 15:09:12'),
(61, 45, 'Item', 22, '2024-12-13 15:10:32'),
(62, 45, 'Item', 47, '2024-12-13 15:10:32'),
(63, 45, 'Item', 48, '2024-12-13 15:10:32'),
(64, 45, 'Item', 36, '2024-12-13 15:10:32'),
(65, 24, 'Item', 49, '2024-12-13 15:11:45'),
(66, 24, 'Item', 50, '2024-12-13 15:11:45'),
(67, 19, 'Item', 51, '2024-12-13 15:13:17'),
(68, 19, 'Item', 52, '2024-12-13 15:13:17'),
(69, 19, 'Item', 1, '2024-12-13 15:13:17'),
(70, 19, 'Item', 53, '2024-12-13 15:13:17'),
(71, 16, 'Item', 51, '2024-12-13 15:14:31'),
(72, 16, 'Item', 52, '2024-12-13 15:14:31'),
(73, 16, 'Item', 1, '2024-12-13 15:14:31'),
(74, 16, 'Item', 53, '2024-12-13 15:14:31'),
(75, 19, 'Item', 54, '2024-12-21 14:43:56'),
(76, 45, 'Item', 55, '2024-12-21 14:44:24'),
(77, 42, 'Item', 55, '2024-12-21 14:44:39'),
(81, 11, 'Item', 4, '2024-12-21 14:45:43'),
(83, 9, 'Item', 56, '2024-12-21 14:46:25'),
(84, 41, 'Item', 57, '2024-12-21 14:47:02'),
(85, 4, 'Item', 57, '2024-12-21 14:47:16'),
(86, 11, 'Item', 57, '2024-12-21 14:47:31'),
(87, 3, 'Item', 57, '2024-12-21 14:47:42'),
(88, 7, 'Item', 57, '2024-12-21 14:49:20'),
(89, 45, 'Item', 58, '2024-12-21 14:52:51'),
(90, 42, 'Item', 58, '2024-12-21 14:55:31'),
(91, 41, 'Item', 59, '2024-12-21 14:56:55'),
(92, 40, 'Item', 56, '2024-12-21 15:06:41'),
(93, 40, 'Item', 58, '2024-12-21 15:06:41'),
(94, 19, 'Item', 58, '2024-12-21 15:07:48'),
(95, 11, 'Item', 58, '2024-12-21 15:08:25'),
(96, 9, 'Item', 59, '2024-12-21 15:11:28'),
(97, 7, 'Item', 60, '2024-12-21 15:14:27'),
(98, 4, 'Item', 59, '2024-12-21 15:15:13'),
(99, 3, 'Item', 58, '2024-12-21 15:16:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_schema_migrations`
--

CREATE TABLE `omeka_schema_migrations` (
  `version` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_schema_migrations`
--

INSERT INTO `omeka_schema_migrations` (`version`) VALUES
('20100401000000'),
('20100810120000'),
('20110113000000'),
('20110124000001'),
('20110301103900'),
('20110328192100'),
('20110426181300'),
('20110601112200'),
('20110627223000'),
('20110824110000'),
('20120112100000'),
('20120220000000'),
('20120221000000'),
('20120224000000'),
('20120224000001'),
('20120402000000'),
('20120516000000'),
('20120612112000'),
('20120623095000'),
('20120710000000'),
('20120723000000'),
('20120808000000'),
('20120808000001'),
('20120813000000'),
('20120914000000'),
('20121007000000'),
('20121015000000'),
('20121015000001'),
('20121018000001'),
('20121110000000'),
('20121218000000'),
('20130422000000'),
('20130426000000'),
('20130429000000'),
('20130701000000'),
('20130809000000'),
('20140304131700'),
('20150211000000'),
('20150310141100'),
('20150814155100'),
('20151118214800'),
('20151209103299'),
('20151209103300'),
('20161209171900'),
('20170331084000'),
('20170405125800'),
('20200127165700');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_search_texts`
--

CREATE TABLE `omeka_search_texts` (
  `id` int(10) UNSIGNED NOT NULL,
  `record_type` varchar(30) NOT NULL,
  `record_id` int(10) UNSIGNED NOT NULL,
  `public` tinyint(1) NOT NULL,
  `title` mediumtext DEFAULT NULL,
  `text` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_search_texts`
--

INSERT INTO `omeka_search_texts` (`id`, `record_type`, `record_id`, `public`, `title`, `text`) VALUES
(1, 'Item', 1, 0, 'Bad Bunny', 'Música Urbana Bad Bunny '),
(2, 'Item', 2, 0, 'Wagon Wheel (Old Crow Medicine Show)', '2004 Country Country Tradicional Wagon Wheel (Old Crow Medicine Show) '),
(3, 'Item', 3, 1, 'Animals (Martin Garrix)', '2013 Europa Más de 4 minutos Pop Pop Electrónico Animals (Martin Garrix) Electrónica \"Animals\" es una pista instrumental que se destaca por su potente drop y melodía pegajosa, convirtiéndose en un himno en festivales de música electrónica y consolidando la carrera de Martin Garrix a nivel internacional. Martijn Garristen EP Gold Skies 17 de Junio de 2013 Bajo derechos de autor, propiedad de Spinnin\' Records Sin letra Música '),
(4, 'Item', 4, 1, 'Bad Romance (Lady Gaga)', '2009 América del Norte Más de 4 minutos Pop Pop Mainstream Bad Romance (Lady Gaga) Pop Alternativo \"Bad Romance\" es una canción de pop electrónico con influencias dance y elementos góticos, conocida por su pegajoso estribillo y su icónico videoclip. Lady Gaga Nadir Khayat The Fame Monster 23 de Octubre de 2009 RedOne Bajo derechos de autor, propiedad de Interscope Records y Streamline Records Música Inglés '),
(5, 'Item', 5, 0, 'Lacrimosa (Mozart)', '1791 Música Clásica Lacrimosa (Mozart) '),
(6, 'Item', 6, 0, 'Stay (Justin Bieber)', '2021 Pop Pop Alternativo Stay (Justin Bieber) '),
(7, 'Item', 7, 1, 'Back in Black (AC/DC)', '1980 Más de 4 minutos Oceanía Rock Back in Black (AC/DC) Rock Clásico \"Back In Black\" es una de las canciones más icónicas de AC/DC, con una potente combinación de riffs de guitarra y una energía que rinde homenaje al fallecido vocalista Bon Scott. Angus Young Malcolm Young Brian Johnson Back In Black 25 de Julio de 1980 Robert John \"Mutt\" Lange Bajo derechos de autor, propiedad de Albert Productions y Atlantic Records Música Inglés '),
(8, 'Item', 8, 0, 'The girl from Ipanema (Antonio Carlos Jobim)', '1962 The girl from Ipanema (Antonio Carlos Jobim) '),
(9, 'Item', 9, 1, 'Take me home, Country Roads (John Denver)', '1971 3-4 minutos América del Norte Country Take me home, Country Roads (John Denver) John Denver Poems, Prayers & Promises 5 de Abril de 1971 Bill Danoff y Taffy Nivert Country Tradicional Bajo derechos de autor, propiedad de RCA Records Inglés Música '),
(10, 'Item', 10, 0, 'Cayó la Noche Remix', '2021 Música Urbana Cayó la Noche Remix '),
(11, 'Item', 11, 1, 'Yellow (Coldplay)', '2000 Europa Más de 4 minutos Pop Yellow (Coldplay) Pop Rock \"Yellow\" es una balada que combina melodías melancólicas con letras que expresan devoción y admiración profunda.\r\nLa canción utiliza el color amarillo como metáfora de calidez, felicidad y luminosidad.\r\nHa sido interpretada como una expresión de amor incondicional y ha resonado con muchos oyentes por su emotividad y sencillez. Chris Martin Jonny Bucklard Guy Berryman Will Champion Parachutes 26 de Junio de 2000 Ken Nelson Bajo derechos de autor, propiedad de Parlophone Música Inglés '),
(12, 'Item', 12, 0, 'Te boté Remix', '2017 Música Urbana Te boté Remix '),
(13, 'Item', 13, 0, 'Adele', 'Adele '),
(14, 'Item', 14, 0, 'Mora', 'Mora '),
(15, 'Item', 15, 0, 'Rosalía', 'Rosalía '),
(16, 'Item', 16, 0, 'Memorias ft. Jhayco', '2012 Microdosis Música Urbana Reggaeton Memorias ft. Jhayco '),
(17, 'Item', 17, 0, 'Joji', 'Joji '),
(19, 'Item', 19, 1, 'La Inocente ft. Feid', '2012 Europa Menos de 2 minutos Microdosis Música Urbana Reggaeton La Inocente ft. Feid Reggaeton \"La Inocente\" es una canción del artista puertorriqueño Mora, lanzada en 2020. En esta canción, Mora canta sobre una relación amorosa que parece estar basada en una inocencia y vulnerabilidad emocional, reflejando sentimientos de pasión, duda y amor no correspondido. La canción fusiona el reguetón con un toque melódico suave, lo que caracteriza el estilo único de Mora, que a menudo mezcla letras románticas con ritmos urbanos. Mora Feid Microdosis 1 de Abril de 2020 Bajo derechos de autor, propiedad de Warner Music Español Música '),
(20, 'Item', 20, 0, 'Quevedo', 'Quevedo '),
(21, 'Item', 21, 0, 'Devuélveme a mi chica', 'Devuélveme a mi chica '),
(22, 'Item', 22, 0, 'Kanye West', 'Kanye West '),
(23, 'Item', 23, 0, 'Mac DeMarco', 'Mac DeMarco '),
(24, 'Item', 24, 0, 'Smells like teen spirit (Nirvana)', '1991 Nevermind Smells like teen spirit (Nirvana) '),
(25, 'Item', 25, 0, 'Nectar', 'Nectar '),
(26, 'Item', 26, 0, 'The Bones (Maren Morris)', 'The Bones (Maren Morris) '),
(27, 'Item', 27, 0, 'Niggas in Paris (JAY-Z)', 'Niggas in Paris (JAY-Z) '),
(28, 'Item', 28, 0, 'ESTE (El Alfa)', 'ESTE (El Alfa) '),
(29, 'Item', 29, 0, 'EL CHACAL (Mora)', 'EL CHACAL (Mora) '),
(30, 'Item', 30, 0, 'No More Parties in LA (Kanye West)', 'No More Parties in LA (Kanye West) '),
(31, 'Item', 31, 0, 'Dream On (Aerosmith)', 'Dream On (Aerosmith) '),
(32, 'Item', 32, 0, 'Sweet Child O\' Mine', 'Sweet Child O\' Mine '),
(33, 'Item', 33, 0, 'i like the way you kiss me', 'i like the way you kiss me '),
(34, 'Collection', 1, 1, 'Rock', 'Rock Español Música Género derivado del rock and roll, caracterizado por guitarras eléctricas, ritmos fuertes y letras que suelen expresar rebeldía o emociones intensas. Tiene múltiples subgéneros como hard rock, punk y grunge. '),
(35, 'Collection', 2, 1, 'Pop', 'Pop Español Música Música popular con melodías pegajosas y estructuras sencillas, diseñada para un público amplio. Tiende a incorporar elementos de otros géneros y prioriza la accesibilidad y el entretenimiento. '),
(36, 'Collection', 3, 0, 'Música Urbana', 'Música Urbana Español Música Género que agrupa estilos como el reguetón, rap, trap y hip-hop. Suelen tener ritmos pegajosos, letras narrativas y temáticas urbanas con influencia de la vida callejera y el movimiento cultural. '),
(37, 'Collection', 4, 1, 'Country', 'Country Español Música Nacido en el sur de Estados Unidos, se caracteriza por el uso de guitarras acústicas, banjos y letras que cuentan historias de la vida rural, el amor y los valores tradicionales. '),
(38, 'Collection', 5, 0, 'Metal', 'Metal Español Música Género caracterizado por su sonido fuerte y pesado, con guitarras eléctricas distorsionadas, baterías rápidas y potentes, y voces intensas. A menudo aborda temas oscuros, filosóficos o sociales. Se divide en subgéneros como heavy metal, thrash metal, death metal y black metal, entre otros, cada uno con características particulares en cuanto a ritmo, velocidad y técnica. '),
(39, 'Collection', 6, 0, 'Jazz', 'Jazz Español Música Género nacido en Estados Unidos a finales del siglo XIX. Destaca por su improvisación, complejidad armónica y ritmos sincopados. Utiliza instrumentos como el saxofón, la trompeta y el piano. '),
(40, 'Collection', 7, 1, 'Música Clásica', 'Música Clásica Español Música Música formal y académica que abarca desde el período barroco hasta el contemporáneo. Suele interpretarse con orquestas y se centra en la composición estructurada y expresiva. '),
(41, 'Collection', 8, 1, 'Electrónica', 'Electrónica Español Música Música creada principalmente con sintetizadores y equipos digitales. Es común en clubes y festivales, con subgéneros como house, techno, trance y dubstep. '),
(42, 'Collection', 9, 1, 'Alternativa', 'Alternativa Español Música Género amplio que abarca música fuera de las corrientes comerciales tradicionales. Suelen destacar por la experimentación y la fusión de estilos, con una actitud independiente o contracultural. '),
(43, 'Item', 34, 0, 'Fly Me to the Moon (Frank Sinatra)', 'Jazz Jazz Tradicional Fly Me to the Moon (Frank Sinatra) '),
(44, 'Item', 35, 0, 'Birds Of Fire (Mahavishnu Orchestra)', 'Jazz Jazz Fusión Birds Of Fire (Mahavishnu Orchestra) '),
(45, 'Item', 36, 0, 'Selected (Charlotte de Witte)', '2019 Electrónica Electrónica Techno Selected EP Selected (Charlotte de Witte) '),
(46, 'Item', 37, 0, 'One Kiss (Calvin Harris & Dua Lipa)', '2018 Electrónica Electrónica House One Kiss (Calvin Harris & Dua Lipa) '),
(47, 'Item', 38, 0, 'Like a Bitch (Zomboy)', '2016 Electrónica Electrónica Dubstep Neon Grave EP Like a Bitch (Zomboy) '),
(48, 'Item', 39, 0, 'Video Games (Lana del Rey)', '2011 Alternativa Born to Die Indie Pop Video Games (Lana del Rey) '),
(49, 'Item', 40, 1, 'Creep (Radiohead)', '1992 3-4 minutos Alternativa Europa Indie Rock Pablo Honey Creep (Radiohead) Indie Rock \"Creep\" es una canción melancólica y emocional que habla sobre la alienación, la inseguridad y el deseo de pertenecer. Es conocida por su poderosa interpretación vocal de Thom Yorke y la atmósfera sombría creada por los guitarras distorsionadas. Aunque inicialmente no fue un gran éxito, \"Creep\" se convirtió en un himno para muchos por su profunda resonancia emocional. Radiohead Pablo Honey 21 de Septiembre de 1992 Thom Yorke Bajo derechos de autor, propiedad de Radiohead Inglés Música Jonny Greenwood  Ed O\'Brien Colin Greenwood Phil Selway '),
(50, 'Item', 41, 1, 'xanny (Billie Eilish)', '2019 Alternativa Alternativa Experimental América del Norte Más de 4 minutos When we all fall asleep where do we go xanny (Billie Eilish) Alternativa experimental \"xanny\" es una canción de Billie Eilish que forma parte de su álbum WHEN WE ALL FALL ASLEEP, WHERE DO WE GO? de 2019. La canción trata sobre la presión social de consumir sustancias, como el alcohol y las drogas, para encajar. Billie canta sobre cómo rechaza ese estilo de vida, destacando la incomodidad y el vacío que sienten las personas que recurren a estas sustancias. Musicalmente, la canción tiene una atmósfera tranquila y melancólica, con un estilo vocal único de Billie, que se fusiona con una producción minimalista. Billie Eilish WHEN WE ALL FALL ASLEEP, WHERE DO WE GO? 29 de Marzo de 2019 Finneas O\'Connell Bajo derechos de autor, propiedad de Darkroom y Interscope Records Inglés Música '),
(51, 'Item', 42, 1, 'La Nozze di Fígaro (Mozart)', '1786 2-3 minutos Europa Música Clásica Ópera La Nozze di Fígaro (Mozart) Música Clásica, Ópera \"Le Nozze di Figaro\" es una ópera cómica en cuatro actos compuesta por Wolfgang Amadeus Mozart. Basada en la obra de teatro La folle journée, ou Le Mariage de Figaro de Pierre Beaumarchais, cuenta la historia de enredos amorosos y conflictos sociales entre los sirvientes Figaro y Susanna y sus amos, el Conde y la Condesa Almaviva. Wolfgang Amadeus Mozart 1 de Mayo de 1786 Lorenzo Da Ponte Dominio público Italiano Música '),
(52, 'Item', 43, 0, 'Pierrot Lunaire (Arnoldo Schoenberg)', '1912 Moderna Música Clásica Pierrot Lunaire (Arnoldo Schoenberg) '),
(53, 'Item', 44, 0, 'Dies Irae (cánticos gregorianos)', 'Cantos y Rituales Música Folklórica Dies Irae (cánticos gregorianos) '),
(54, 'Collection', 10, 1, 'Música Folklórica', 'Música Folklórica Español Música Música tradicional que representa la identidad cultural y las raíces de un pueblo o región. Se caracteriza por instrumentos autóctonos, letras que narran historias locales y ritmos típicos de cada comunidad. '),
(55, 'Item', 45, 1, 'Malamente (Rosalía)', '2-3 minutos 2018 El mal querer Europa Flamenco Música Folklórica Malamente (Rosalía) Flamenco \"Malamente\" fusiona elementos del flamenco tradicional con sonidos urbanos y pop, destacando por su innovadora producción y la potente interpretación vocal de Rosalía. La canción aborda temas de presagios y presentimientos en una relación amorosa. Rosalía Vila El mal querer 30 de Mayo de 2018 Pablo Díaz-Reixa Bajo derechos de autor, propiedad de Columbia Records Música Español '),
(56, 'Collection', 11, 1, 'Contactos', 'Contactos ¿Tienes alguna pregunta o necesitas más información? Estamos aquí para ayudarte. En nuestra sección de contacto, puedes ponerte en comunicación con nuestro equipo para resolver cualquier duda, enviar comentarios o solicitar soporte. Nos aseguraremos de responderte lo más rápido posible. ¡Tu opinión es muy importante para nosotros! '),
(57, 'Item', 46, 1, 'Equipo de soporte', 'Abel Martínez Molina: abelmartinezmolina5@gmail.com Jose Antonio Díaz Soriano: jose.antonio.diaz.soriano@gmail.com Javier Nerja Aguilar: javierner2005@gmail.com Equipo de soporte Gmail de contacto de cada miembro del equipo '),
(62, 'SimplePagesPage', 4, 1, 'This Old Dog, el icónico álbum de Mac DeMarco', 'This Old Dog, el icónico álbum de Mac DeMarco <p><span style=\"font-weight:400;\">El cantautor canadiense </span><b>Mac DeMarco</b><span style=\"font-weight:400;\"> lanzó su tercer álbum de estudio, </span><b><i>This Old Dog</i></b><span style=\"font-weight:400;\">, el </span><b>5 de mayo de 2017</b><span style=\"font-weight:400;\">. Este proyecto marcó un giro hacia un sonido más íntimo y acústico en comparación con sus trabajos anteriores. Con 13 temas, el álbum explora temas como la nostalgia, las relaciones familiares y el paso del tiempo.</span></p>\r\n<h3><b>¿Por qué es importante este álbum?</b></h3>\r\n<p><i><span style=\"font-weight:400;\">This Old Dog</span></i><span style=\"font-weight:400;\"> consolidó a Mac DeMarco como uno de los artistas indie más influyentes de su generación. En comparación con su álbum anterior, </span><i><span style=\"font-weight:400;\">Salad Days</span></i><span style=\"font-weight:400;\"> cuyo álbum tiene canciones muy conocidas como Chamber of Reflection, este trabajo muestra un enfoque más maduro y melancólico, con letras profundamente personales y arreglos minimalistas.</span></p>\r\n<p><span style=\"font-weight:400;\">El álbum también recibió elogios de la crítica por su autenticidad y enfoque introspectivo, alcanzando altas posiciones en listas de popularidad globales y recibiendo múltiples premios en el mundo de la música independiente / indie.</span></p>\r\n<h3><b>¿Qué canciones destacan?</b></h3>\r\n<p><span style=\"font-weight:400;\">Muchos fans dicen que este es el mejor álbum de momento en la carrera de Mac DeMarco, explicando que no existe una canción mala, aunque por reproducciones las más conocidas son:</span></p>\r\n<p><b></b></p>\r\n<ul>\r\n<li><b>For the first time: <span style=\"font-weight:400;\">Tiene un aire nostálgico, marcado por el uso prominente de sintetizadores suaves y una línea de bajo melódica. La letra aborda la sensación de redescubrir el amor y la intimidad, evocando tanto ilusión como vulnerabilidad</span></b></li>\r\n</ul>\r\n<ul>\r\n<li>Still beating: <span style=\"font-weight:400;\">En esta cancion se trata el tema de la fragilidad emocional que acompaña a las relaciones. La melodía dulce y la guitarra acústica proporcionan un contraste perfecto con la sinceridad de la letra, donde Mac DeMarco reflexiona sobre su propio orgullo y su necesidad de reconexión.</span></li>\r\n</ul>\r\n<p></p>\r\n<p><b></b></p>\r\n<ul>\r\n<li><b>Moonlight on the river: <span style=\"font-weight:400;\">Este tema empieza con una simple estructura melódica, pero en la segunda parte de esta canción empieza a añadir un “paisaje sonoro”, metiendo ruidos de delfines. Trata el tema de la muerte y la pérdida, reflejando un tema de tranquilidad.</span></b></li>\r\n</ul>\r\n<ul>\r\n<li><strong>Watching him fade away:</strong> <span style=\"font-weight:400;\">Esta canción da el cierre a This Old Dog, una de las más personales y desgarradoras de Mac DeMarco. La letra se centra en la relación distante con su padre y la inevitable aceptación de que el tiempo no cambiará su desconexión emocional.</span></li>\r\n</ul>\r\n<p></p>\r\n<h3><b>¿Cómo es el concepto del álbum?</b></h3>\r\n<p><i><span style=\"font-weight:400;\">This Old Dog</span></i><span style=\"font-weight:400;\"> es un retrato sonoro de la madurez y la aceptación. A través de melodías simples pero emotivas, invita a los oyentes a reflexionar sobre sus propias experiencias personales. El título del álbum simboliza tanto la lealtad como el inevitable desgaste que acompaña al envejecimiento.</span></p>\r\n<p><span style=\"font-weight:400;\">El diseño de la portada, que muestra un retrato caricaturesco del propio Mac DeMarco, refuerza el carácter sencillo y personal del proyecto para poder empatizar con él.</span></p>\r\n<h3><b>¿Qué impacto inicial tuvo?</b></h3>\r\n<p><span style=\"font-weight:400;\">Desde su lanzamiento, </span><i><span style=\"font-weight:400;\">This Old Dog</span></i><span style=\"font-weight:400;\"> recibió elogios tanto de críticos como de fans, siendo reconocido como uno de los mejores álbumes de 2017. Su popularidad llevó a Mac a realizar una extensa gira mundial, solidificando su posición como referente del género indie rock, además de dar una gran fama al género indie.</span></p>\r\n<h3><b>¿Por qué deberías escucharlo?</b></h3>\r\n<p><span style=\"font-weight:400;\">Si eres una persona que valora la música introspectiva y con un toque de nostalgia, This Old Dog es un álbum hecho para ti. Está dirigido a quienes buscan canciones con profundidad emocional, ideales para momentos de reflexión o para disfrutar en un ambiente relajado.</span></p>\r\n<p style=\"text-align:right;\"><strong>Jose Antonio Díaz Soriano</strong></p> '),
(59, 'SimplePagesPage', 1, 1, 'Noticias', 'Noticias <p>En esta sección, mantente al tanto de las últimas novedades del mundo de la música. Aquí encontrarás artículos, lanzamientos y análisis sobre nuevas canciones, álbumes y artistas. Disfruta de nuestras reseñas detalladas, entrevistas exclusivas y actualizaciones sobre las tendencias musicales más actuales. ¡No te pierdas ninguna de las canciones que están marcando tendencia y descubre lo último en el universo musical!</p> '),
(60, 'SimplePagesPage', 2, 1, '¿Qué es “Buenas Noches”, el nuevo álbum  de Quevedo?', '¿Qué es “Buenas Noches”, el nuevo álbum  de Quevedo? <p>El artista español <strong>Pedro Domínguez Quevedo</strong> lanzó su esperado segundo álbum de estudio, titulado Buenas Noches, el <strong>24 de noviembre de 2024</strong>. Este proyecto llega tras el éxito de su primer disco y busca consolidar su posición en la música urbana. Con <strong>15 canciones inéditas</strong>, el álbum explora temas como la introspección, las relaciones personales y la vida nocturna.<br />Puedes escuchar Buenas Noches en las principales plataformas de streaming como <a href=\"https://open.spotify.com/intl-es\" target=\"_blank\" title=\"Spotify\" rel=\"noreferrer noopener\">Spotify</a>, <a href=\"https://music.apple.com/es/new\" target=\"_blank\" title=\"Apple Music\" rel=\"noreferrer noopener\">Apple</a><br /><a href=\"https://music.apple.com/es/new\" target=\"_blank\" title=\"Apple Music\" rel=\"noreferrer noopener\">Music</a> y <a href=\"https://music.youtube.com/\" target=\"_blank\" title=\"Youtube Music\" rel=\"noreferrer noopener\">YouTubeMusic</a>.</p>\r\n<p></p>\r\n<h2>¿Por qué es importante este lanzamiento?</h2>\r\n<p>El disco es el primer trabajo de larga duración de Quevedo desde <strong>Donde Quiero Estar</strong>, que debutó como número uno en España y varios países de habla hispana en 2023. Su anterior éxito mundial, Quédate (incluido en la sesión #52 con Bizarrap), posicionó al cantante como uno de los referentes del género urbano.<br />Con<strong> Buenas Noches</strong>, Quevedo busca consolidar su estilo, colaborar con nuevos artistas y ofrecer un sonido más evolucionado.</p>\r\n<h2>¿Qué canciones destacan?</h2>\r\n<p>El álbum incluye sencillos que han tenido gran impacto y nuevas colaboraciones con artistas reconocidos. Algunos temas destacados son:<br />● <strong>\"GranVía\"</strong>: Una colaboración con la artista catalana Aitana.<br />● <strong>\"Iguales\"</strong>: Una canción cuyo adelanto hizo que fuese una de las más esperadas por los fans.<br />● <strong>\"Mr.Moondial\"</strong>: Una colaboración con el artista mundialmente conocido, Pitbull.<br />El repertorio combina géneros como trap, reguetón y fusiones acústicas. Esto permite conectar con distintos públicos, desde amantes de la fiesta hasta quienes buscan canciones introspectivas.</p>\r\n<h2>¿Cómo es el concepto del álbum?</h2>\r\n<p>El título Buenas Noches hace alusión a la dualidad entre la noche como espacio para la diversión y como momento para reflexionar. Este enfoque se refleja en las letras, que alternan entre historias de fiestas, desamor y autodescubrimiento. Además, Quevedo ha destacado que el álbum es una invitación a acompañar a los oyentes en sus momentos más personales.<br />El arte de la portada, que muestra un paisaje urbano nocturno, refuerza este concepto. Según declaraciones del artista, la estética visual busca transmitir una sensación de intimidad.</p>\r\n<h2>¿Dónde se grabó y quién participó?</h2>\r\n<p>La grabación del álbum se llevó a cabo en <strong>estudios de Madrid y Miami</strong>, ciudades clave para la música urbana. En la producción participaron colaboradores de renombre como:<br />● <strong>BlueFire</strong>: Reconocido productor español.<br />● <strong>Garabatto</strong>: Productor que trabajó en temas destacados de C. Tangana.<br />● <strong>KIDDO</strong>:Productor y amigo personal del cantante.<br />Estos nombres garantizan un sonido pulido y competitivo en el panorama global.</p>\r\n<h2>¿Qué impacto inicial ha tenido?</h2>\r\n<p>A solo días de su lanzamiento, Buenas Noches ya ha recibido millones de reproducciones en plataformas digitales. El álbum debutó en el <strong>Top 10 global de Spotify</strong>, colocando todas sus canciones dentro del <strong>Top 20 de España</strong>, mostrando su rápida aceptación por parte del público.<br />Además, el artista anunció una <strong>gira internacional</strong> que comenzará en febrero de 2025. Las fechas incluyen paradas en ciudades de Europa, América Latina y Estados Unidos. Los boletos estarán disponibles en <a href=\"https://www.tomaticket.com/\" target=\"_blank\" rel=\"noreferrer noopener\">TomaTicket.com</a>.</p>\r\n<h2>¿Por qué deberías escucharlo?</h2>\r\n<p>Buenas Noches es un álbum que combina ritmos pegadizos con letras sinceras, ofreciendo algo para todos los gustos. Si te interesa la música urbana, este disco es una oportunidad para conocer a uno de los artistas más destacados del momento.<br />Escúchalo ahora y forma parte de la conversación.</p>\r\n<p style=\"text-align:right;\"><em><strong> Abel Martínez Molina</strong></em></p> '),
(61, 'SimplePagesPage', 3, 1, 'Lady Gaga lanza “Bad Romance” y redefine la música pop', 'Lady Gaga lanza “Bad Romance” y redefine la música pop <h2><span><strong>¿Qué es “Bad Romance”?</strong></span></h2>\r\n<p><span>Lady Gaga lanzó la canción </span><span><strong>“Bad Romance”</strong></span><span> el </span><span><strong>23 de octubre de 2009</strong></span><span> como parte del EP </span><span><em>The Fame Monster</em></span><span>. La canción explora el deseo de experimentar relaciones intensas, incluso si estas conllevan dolor o desafíos. Escrita por Gaga y Nadir \"RedOne\" Khayat, se convirtió en un éxito instantáneo y marcó un antes y un después en su carrera.</span></p>\r\n<p><span></span></p>\r\n<h2><span><strong>¿Por qué es tan influyente?</strong></span></h2>\r\n<p><span>“Bad Romance” destaca por su impacto global:</span></p>\r\n<ul>\r\n<li>\r\n<p><span><strong>Éxito comercial</strong></span><span>: Alcanzó el n.º 1 en más de 20 países, incluyendo Estados Unidos, Canadá y Alemania. Ha vendido más de 12 millones de copias en todo el mundo.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Reconocimientos</strong></span><span>: Obtuvo varios premios, entre ellos el </span><span><strong>Grammy a la Mejor Interpretación Vocal Pop Femenina</strong></span><span>.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Cultura pop</strong></span><span>: Su estilo y su mensaje se adoptaron como un himno para comunidades que valoran la autenticidad y la autoexpresión.</span><br /><span></span></p>\r\n</li>\r\n</ul>\r\n<h2><span><strong>¿Cómo se creó?</strong></span></h2>\r\n<p><span>La producción de “Bad Romance” fue meticulosa:</span></p>\r\n<ol>\r\n<li>\r\n<p><span><strong>Escritura</strong></span><span>: Gaga desarrolló la letra durante su gira </span><span><em>The Fame Ball Tour</em></span><span>. La canción aborda la lucha entre el amor puro y las dificultades en las relaciones.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Grabación</strong></span><span>: Se realizó en los estudios Record Plant en Los Ángeles.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Producción musical</strong></span><span>: Con sintetizadores electrónicos y una estructura teatral, la canción atrapa desde los primeros acordes.</span></p>\r\n</li>\r\n</ol>\r\n<h2><span><strong>El video musical: una obra visual inolvidable</strong></span></h2>\r\n<p><span>Dirigido por </span><span><strong>Francis Lawrence</strong></span><span>, el video de “Bad Romance” se estrenó el </span><span><strong>10 de noviembre de 2009</strong></span><span>. Su narrativa muestra a Gaga como prisionera de un grupo de compradores que terminan adquiriéndola en una subasta. Este simbolismo refleja temas como el control y la lucha por el poder en las relaciones.</span></p>\r\n<ul>\r\n<li>\r\n<p><span><strong>Diseño visual</strong></span><span>: Combina elementos futuristas con referencias góticas. Los atuendos fueron diseñados por Alexander McQueen, realzando el impacto visual.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Recepción</strong></span><span>: Superó los mil millones de reproducciones en YouTube, consolidándose como uno de los videos musicales más vistos de la década.</span></p>\r\n</li>\r\n</ul>\r\n<h2><span><strong>Impacto en listas y premios</strong></span></h2>\r\n<ul>\r\n<li>\r\n<p><span><strong>Ventas certificadas</strong></span><span>: En Estados Unidos, obtuvo certificación de </span><span><strong>Diamante</strong></span><span> por la RIAA.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Premios internacionales</strong></span><span>: Además del Grammy, ganó <strong>tres MTV Video Music Awards en 2010</strong>, incluyendo Mejor Video del Año.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Posición en rankings</strong></span><span>: La revista </span><span><em>Rolling Stone</em></span><span> la incluyó en su lista de las 500 mejores canciones de todos los tiempos.</span></p>\r\n</li>\r\n</ul>\r\n<h2><span><strong>Influencia en la industria musical</strong></span></h2>\r\n<p><span>“Bad Romance” estableció un nuevo estándar en la música pop:</span></p>\r\n<ol>\r\n<li>\r\n<p><span><strong>Innovación visual y sonora</strong></span><span>: Inspiró a artistas como Katy Perry y Billie Eilish a explorar temas complejos en sus trabajos.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Legado cultural</strong></span><span>: Se adoptó como un himno en movimientos sociales, especialmente dentro de la comunidad LGBTQ+.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Relevancia continuada</strong></span><span>: Más de una década después de su lanzamiento, sigue siendo una referencia en la cultura pop global.</span></p>\r\n</li>\r\n</ol>\r\n<h2><span><strong>¿Qué opinan los críticos?</strong></span></h2>\r\n<p><span>La recepción de la crítica ha sido abrumadoramente positiva:</span></p>\r\n<ul>\r\n<li>\r\n<p><span><em>Pitchfork</em></span><span> elogió su \"producción impecable\" y la consideró un hito dentro del pop electrónico.</span></p>\r\n</li>\r\n<li>\r\n<p><span><em>Billboard</em></span><span> la describió como una \"combinación perfecta de arte y comercio musical\".</span></p>\r\n</li>\r\n</ul>\r\n<h2><span><strong>Descúbrela hoy</strong></span><span><strong></strong></span></h2>\r\n<p><span>Si no has escuchado “Bad Romance”, este es el momento. Encuéntrala en </span><a href=\"https://open.spotify.com/intl-es\" target=\"_blank\" title=\"Spotify\" rel=\"noreferrer noopener\"><span>Spotify</span></a><span>, mira su video en </span><a href=\"https://www.youtube.com\" target=\"_blank\" title=\"YouTube\" rel=\"noreferrer noopener\"><span>YouTube</span></a><span> y forma parte de su legado. ¡Descubre por qué sigue siendo una de las canciones más icónicas de todos los tiempos!</span></p>\r\n<p style=\"text-align:right;\"><strong>Javier Nerja Aguilar</strong></p> ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_sessions`
--

CREATE TABLE `omeka_sessions` (
  `id` varchar(128) NOT NULL,
  `modified` bigint(20) DEFAULT NULL,
  `lifetime` int(11) DEFAULT NULL,
  `data` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_sessions`
--

INSERT INTO `omeka_sessions` (`id`, `modified`, `lifetime`, `data`) VALUES
('17msvanastqe73ifdpnni975tt', 1734873363, 1209600, 0x44656661756c747c613a313a7b733a383a227265646972656374223b733a313a222f223b7d5a656e645f417574687c613a313a7b733a373a2273746f72616765223b693a313b7d4f6d656b6153657373696f6e43737266546f6b656e7c613a313a7b733a353a22746f6b656e223b733a33323a223639373265626130373732363431303335663138333436633131653339323465223b7d5f5f5a467c613a323a7b733a34333a225a656e645f466f726d5f456c656d656e745f486173685f73616c745f617070656172616e63655f63737266223b613a323a7b733a343a22454e4e48223b693a313b733a333a22454e54223b693a313733343837363638333b7d733a34333a225a656e645f466f726d5f456c656d656e745f486173685f73616c745f6e617669676174696f6e5f63737266223b613a323a7b733a343a22454e4e48223b693a313b733a333a22454e54223b693a313733343837363736313b7d7d5a656e645f466f726d5f456c656d656e745f486173685f73616c745f617070656172616e63655f637372667c613a313a7b733a343a2268617368223b733a33323a226632653165333933356533353837613038376663323165353034316665616230223b7d5a656e645f466f726d5f456c656d656e745f486173685f73616c745f6e617669676174696f6e5f637372667c613a313a7b733a343a2268617368223b733a33323a223561343561646362373636323462346266353232623431626339343831356539223b7d);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_simple_pages_pages`
--

CREATE TABLE `omeka_simple_pages_pages` (
  `id` int(10) UNSIGNED NOT NULL,
  `modified_by_user_id` int(10) UNSIGNED NOT NULL,
  `created_by_user_id` int(10) UNSIGNED NOT NULL,
  `is_published` tinyint(1) NOT NULL,
  `title` tinytext NOT NULL,
  `slug` tinytext NOT NULL,
  `text` mediumtext DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `inserted` timestamp NOT NULL DEFAULT '1999-12-31 23:00:00',
  `order` int(10) UNSIGNED NOT NULL,
  `parent_id` int(10) UNSIGNED NOT NULL,
  `template` tinytext NOT NULL,
  `use_tiny_mce` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_simple_pages_pages`
--

INSERT INTO `omeka_simple_pages_pages` (`id`, `modified_by_user_id`, `created_by_user_id`, `is_published`, `title`, `slug`, `text`, `updated`, `inserted`, `order`, `parent_id`, `template`, `use_tiny_mce`) VALUES
(1, 1, 1, 1, 'Noticias', 'noticias', '<p>En esta sección, mantente al tanto de las últimas novedades del mundo de la música. Aquí encontrarás artículos, lanzamientos y análisis sobre nuevas canciones, álbumes y artistas. Disfruta de nuestras reseñas detalladas, entrevistas exclusivas y actualizaciones sobre las tendencias musicales más actuales. ¡No te pierdas ninguna de las canciones que están marcando tendencia y descubre lo último en el universo musical!</p>', '2024-12-21 13:21:24', '2024-12-21 11:31:00', 0, 0, '', 1),
(2, 1, 1, 1, '¿Qué es “Buenas Noches”, el nuevo álbum  de Quevedo?', 'que-es-buenas-noches-el-nuevo-album--de-quevedo', '<p>El artista español <strong>Pedro Domínguez Quevedo</strong> lanzó su esperado segundo álbum de estudio, titulado Buenas Noches, el <strong>24 de noviembre de 2024</strong>. Este proyecto llega tras el éxito de su primer disco y busca consolidar su posición en la música urbana. Con <strong>15 canciones inéditas</strong>, el álbum explora temas como la introspección, las relaciones personales y la vida nocturna.<br />Puedes escuchar Buenas Noches en las principales plataformas de streaming como <a href=\"https://open.spotify.com/intl-es\" target=\"_blank\" title=\"Spotify\" rel=\"noreferrer noopener\">Spotify</a>, <a href=\"https://music.apple.com/es/new\" target=\"_blank\" title=\"Apple Music\" rel=\"noreferrer noopener\">Apple</a><br /><a href=\"https://music.apple.com/es/new\" target=\"_blank\" title=\"Apple Music\" rel=\"noreferrer noopener\">Music</a> y <a href=\"https://music.youtube.com/\" target=\"_blank\" title=\"Youtube Music\" rel=\"noreferrer noopener\">YouTubeMusic</a>.</p>\r\n<p></p>\r\n<h2>¿Por qué es importante este lanzamiento?</h2>\r\n<p>El disco es el primer trabajo de larga duración de Quevedo desde <strong>Donde Quiero Estar</strong>, que debutó como número uno en España y varios países de habla hispana en 2023. Su anterior éxito mundial, Quédate (incluido en la sesión #52 con Bizarrap), posicionó al cantante como uno de los referentes del género urbano.<br />Con<strong> Buenas Noches</strong>, Quevedo busca consolidar su estilo, colaborar con nuevos artistas y ofrecer un sonido más evolucionado.</p>\r\n<h2>¿Qué canciones destacan?</h2>\r\n<p>El álbum incluye sencillos que han tenido gran impacto y nuevas colaboraciones con artistas reconocidos. Algunos temas destacados son:<br />● <strong>\"GranVía\"</strong>: Una colaboración con la artista catalana Aitana.<br />● <strong>\"Iguales\"</strong>: Una canción cuyo adelanto hizo que fuese una de las más esperadas por los fans.<br />● <strong>\"Mr.Moondial\"</strong>: Una colaboración con el artista mundialmente conocido, Pitbull.<br />El repertorio combina géneros como trap, reguetón y fusiones acústicas. Esto permite conectar con distintos públicos, desde amantes de la fiesta hasta quienes buscan canciones introspectivas.</p>\r\n<h2>¿Cómo es el concepto del álbum?</h2>\r\n<p>El título Buenas Noches hace alusión a la dualidad entre la noche como espacio para la diversión y como momento para reflexionar. Este enfoque se refleja en las letras, que alternan entre historias de fiestas, desamor y autodescubrimiento. Además, Quevedo ha destacado que el álbum es una invitación a acompañar a los oyentes en sus momentos más personales.<br />El arte de la portada, que muestra un paisaje urbano nocturno, refuerza este concepto. Según declaraciones del artista, la estética visual busca transmitir una sensación de intimidad.</p>\r\n<h2>¿Dónde se grabó y quién participó?</h2>\r\n<p>La grabación del álbum se llevó a cabo en <strong>estudios de Madrid y Miami</strong>, ciudades clave para la música urbana. En la producción participaron colaboradores de renombre como:<br />● <strong>BlueFire</strong>: Reconocido productor español.<br />● <strong>Garabatto</strong>: Productor que trabajó en temas destacados de C. Tangana.<br />● <strong>KIDDO</strong>:Productor y amigo personal del cantante.<br />Estos nombres garantizan un sonido pulido y competitivo en el panorama global.</p>\r\n<h2>¿Qué impacto inicial ha tenido?</h2>\r\n<p>A solo días de su lanzamiento, Buenas Noches ya ha recibido millones de reproducciones en plataformas digitales. El álbum debutó en el <strong>Top 10 global de Spotify</strong>, colocando todas sus canciones dentro del <strong>Top 20 de España</strong>, mostrando su rápida aceptación por parte del público.<br />Además, el artista anunció una <strong>gira internacional</strong> que comenzará en febrero de 2025. Las fechas incluyen paradas en ciudades de Europa, América Latina y Estados Unidos. Los boletos estarán disponibles en <a href=\"https://www.tomaticket.com/\" target=\"_blank\" rel=\"noreferrer noopener\">TomaTicket.com</a>.</p>\r\n<h2>¿Por qué deberías escucharlo?</h2>\r\n<p>Buenas Noches es un álbum que combina ritmos pegadizos con letras sinceras, ofreciendo algo para todos los gustos. Si te interesa la música urbana, este disco es una oportunidad para conocer a uno de los artistas más destacados del momento.<br />Escúchalo ahora y forma parte de la conversación.</p>\r\n<p style=\"text-align:right;\"><em><strong> Abel Martínez Molina</strong></em></p>', '2024-12-21 14:06:36', '2024-12-21 11:45:30', 0, 1, '', 1),
(3, 1, 1, 1, 'Lady Gaga lanza “Bad Romance” y redefine la música pop', 'lady-gaga-lanza-bad-romance-y-redefine-la-musica-pop', '<h2><span><strong>¿Qué es “Bad Romance”?</strong></span></h2>\r\n<p><span>Lady Gaga lanzó la canción </span><span><strong>“Bad Romance”</strong></span><span> el </span><span><strong>23 de octubre de 2009</strong></span><span> como parte del EP </span><span><em>The Fame Monster</em></span><span>. La canción explora el deseo de experimentar relaciones intensas, incluso si estas conllevan dolor o desafíos. Escrita por Gaga y Nadir \"RedOne\" Khayat, se convirtió en un éxito instantáneo y marcó un antes y un después en su carrera.</span></p>\r\n<p><span></span></p>\r\n<h2><span><strong>¿Por qué es tan influyente?</strong></span></h2>\r\n<p><span>“Bad Romance” destaca por su impacto global:</span></p>\r\n<ul>\r\n<li>\r\n<p><span><strong>Éxito comercial</strong></span><span>: Alcanzó el n.º 1 en más de 20 países, incluyendo Estados Unidos, Canadá y Alemania. Ha vendido más de 12 millones de copias en todo el mundo.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Reconocimientos</strong></span><span>: Obtuvo varios premios, entre ellos el </span><span><strong>Grammy a la Mejor Interpretación Vocal Pop Femenina</strong></span><span>.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Cultura pop</strong></span><span>: Su estilo y su mensaje se adoptaron como un himno para comunidades que valoran la autenticidad y la autoexpresión.</span><br /><span></span></p>\r\n</li>\r\n</ul>\r\n<h2><span><strong>¿Cómo se creó?</strong></span></h2>\r\n<p><span>La producción de “Bad Romance” fue meticulosa:</span></p>\r\n<ol>\r\n<li>\r\n<p><span><strong>Escritura</strong></span><span>: Gaga desarrolló la letra durante su gira </span><span><em>The Fame Ball Tour</em></span><span>. La canción aborda la lucha entre el amor puro y las dificultades en las relaciones.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Grabación</strong></span><span>: Se realizó en los estudios Record Plant en Los Ángeles.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Producción musical</strong></span><span>: Con sintetizadores electrónicos y una estructura teatral, la canción atrapa desde los primeros acordes.</span></p>\r\n</li>\r\n</ol>\r\n<h2><span><strong>El video musical: una obra visual inolvidable</strong></span></h2>\r\n<p><span>Dirigido por </span><span><strong>Francis Lawrence</strong></span><span>, el video de “Bad Romance” se estrenó el </span><span><strong>10 de noviembre de 2009</strong></span><span>. Su narrativa muestra a Gaga como prisionera de un grupo de compradores que terminan adquiriéndola en una subasta. Este simbolismo refleja temas como el control y la lucha por el poder en las relaciones.</span></p>\r\n<ul>\r\n<li>\r\n<p><span><strong>Diseño visual</strong></span><span>: Combina elementos futuristas con referencias góticas. Los atuendos fueron diseñados por Alexander McQueen, realzando el impacto visual.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Recepción</strong></span><span>: Superó los mil millones de reproducciones en YouTube, consolidándose como uno de los videos musicales más vistos de la década.</span></p>\r\n</li>\r\n</ul>\r\n<h2><span><strong>Impacto en listas y premios</strong></span></h2>\r\n<ul>\r\n<li>\r\n<p><span><strong>Ventas certificadas</strong></span><span>: En Estados Unidos, obtuvo certificación de </span><span><strong>Diamante</strong></span><span> por la RIAA.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Premios internacionales</strong></span><span>: Además del Grammy, ganó <strong>tres MTV Video Music Awards en 2010</strong>, incluyendo Mejor Video del Año.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Posición en rankings</strong></span><span>: La revista </span><span><em>Rolling Stone</em></span><span> la incluyó en su lista de las 500 mejores canciones de todos los tiempos.</span></p>\r\n</li>\r\n</ul>\r\n<h2><span><strong>Influencia en la industria musical</strong></span></h2>\r\n<p><span>“Bad Romance” estableció un nuevo estándar en la música pop:</span></p>\r\n<ol>\r\n<li>\r\n<p><span><strong>Innovación visual y sonora</strong></span><span>: Inspiró a artistas como Katy Perry y Billie Eilish a explorar temas complejos en sus trabajos.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Legado cultural</strong></span><span>: Se adoptó como un himno en movimientos sociales, especialmente dentro de la comunidad LGBTQ+.</span></p>\r\n</li>\r\n<li>\r\n<p><span><strong>Relevancia continuada</strong></span><span>: Más de una década después de su lanzamiento, sigue siendo una referencia en la cultura pop global.</span></p>\r\n</li>\r\n</ol>\r\n<h2><span><strong>¿Qué opinan los críticos?</strong></span></h2>\r\n<p><span>La recepción de la crítica ha sido abrumadoramente positiva:</span></p>\r\n<ul>\r\n<li>\r\n<p><span><em>Pitchfork</em></span><span> elogió su \"producción impecable\" y la consideró un hito dentro del pop electrónico.</span></p>\r\n</li>\r\n<li>\r\n<p><span><em>Billboard</em></span><span> la describió como una \"combinación perfecta de arte y comercio musical\".</span></p>\r\n</li>\r\n</ul>\r\n<h2><span><strong>Descúbrela hoy</strong></span><span><strong></strong></span></h2>\r\n<p><span>Si no has escuchado “Bad Romance”, este es el momento. Encuéntrala en </span><a href=\"https://open.spotify.com/intl-es\" target=\"_blank\" title=\"Spotify\" rel=\"noreferrer noopener\"><span>Spotify</span></a><span>, mira su video en </span><a href=\"https://www.youtube.com\" target=\"_blank\" title=\"YouTube\" rel=\"noreferrer noopener\"><span>YouTube</span></a><span> y forma parte de su legado. ¡Descubre por qué sigue siendo una de las canciones más icónicas de todos los tiempos!</span></p>\r\n<p style=\"text-align:right;\"><strong>Javier Nerja Aguilar</strong></p>', '2024-12-22 13:00:04', '2024-12-21 13:19:56', 0, 1, '', 1),
(4, 1, 1, 1, 'This Old Dog, el icónico álbum de Mac DeMarco', 'this-old-dog-el-iconico-album-de-mac-demarco', '<p><span style=\"font-weight:400;\">El cantautor canadiense </span><b>Mac DeMarco</b><span style=\"font-weight:400;\"> lanzó su tercer álbum de estudio, </span><b><i>This Old Dog</i></b><span style=\"font-weight:400;\">, el </span><b>5 de mayo de 2017</b><span style=\"font-weight:400;\">. Este proyecto marcó un giro hacia un sonido más íntimo y acústico en comparación con sus trabajos anteriores. Con 13 temas, el álbum explora temas como la nostalgia, las relaciones familiares y el paso del tiempo.</span></p>\r\n<h3><b>¿Por qué es importante este álbum?</b></h3>\r\n<p><i><span style=\"font-weight:400;\">This Old Dog</span></i><span style=\"font-weight:400;\"> consolidó a Mac DeMarco como uno de los artistas indie más influyentes de su generación. En comparación con su álbum anterior, </span><i><span style=\"font-weight:400;\">Salad Days</span></i><span style=\"font-weight:400;\"> cuyo álbum tiene canciones muy conocidas como Chamber of Reflection, este trabajo muestra un enfoque más maduro y melancólico, con letras profundamente personales y arreglos minimalistas.</span></p>\r\n<p><span style=\"font-weight:400;\">El álbum también recibió elogios de la crítica por su autenticidad y enfoque introspectivo, alcanzando altas posiciones en listas de popularidad globales y recibiendo múltiples premios en el mundo de la música independiente / indie.</span></p>\r\n<h3><b>¿Qué canciones destacan?</b></h3>\r\n<p><span style=\"font-weight:400;\">Muchos fans dicen que este es el mejor álbum de momento en la carrera de Mac DeMarco, explicando que no existe una canción mala, aunque por reproducciones las más conocidas son:</span></p>\r\n<p><b></b></p>\r\n<ul>\r\n<li><b>For the first time: <span style=\"font-weight:400;\">Tiene un aire nostálgico, marcado por el uso prominente de sintetizadores suaves y una línea de bajo melódica. La letra aborda la sensación de redescubrir el amor y la intimidad, evocando tanto ilusión como vulnerabilidad</span></b></li>\r\n</ul>\r\n<ul>\r\n<li>Still beating: <span style=\"font-weight:400;\">En esta cancion se trata el tema de la fragilidad emocional que acompaña a las relaciones. La melodía dulce y la guitarra acústica proporcionan un contraste perfecto con la sinceridad de la letra, donde Mac DeMarco reflexiona sobre su propio orgullo y su necesidad de reconexión.</span></li>\r\n</ul>\r\n<p></p>\r\n<p><b></b></p>\r\n<ul>\r\n<li><b>Moonlight on the river: <span style=\"font-weight:400;\">Este tema empieza con una simple estructura melódica, pero en la segunda parte de esta canción empieza a añadir un “paisaje sonoro”, metiendo ruidos de delfines. Trata el tema de la muerte y la pérdida, reflejando un tema de tranquilidad.</span></b></li>\r\n</ul>\r\n<ul>\r\n<li><strong>Watching him fade away:</strong> <span style=\"font-weight:400;\">Esta canción da el cierre a This Old Dog, una de las más personales y desgarradoras de Mac DeMarco. La letra se centra en la relación distante con su padre y la inevitable aceptación de que el tiempo no cambiará su desconexión emocional.</span></li>\r\n</ul>\r\n<p></p>\r\n<h3><b>¿Cómo es el concepto del álbum?</b></h3>\r\n<p><i><span style=\"font-weight:400;\">This Old Dog</span></i><span style=\"font-weight:400;\"> es un retrato sonoro de la madurez y la aceptación. A través de melodías simples pero emotivas, invita a los oyentes a reflexionar sobre sus propias experiencias personales. El título del álbum simboliza tanto la lealtad como el inevitable desgaste que acompaña al envejecimiento.</span></p>\r\n<p><span style=\"font-weight:400;\">El diseño de la portada, que muestra un retrato caricaturesco del propio Mac DeMarco, refuerza el carácter sencillo y personal del proyecto para poder empatizar con él.</span></p>\r\n<h3><b>¿Qué impacto inicial tuvo?</b></h3>\r\n<p><span style=\"font-weight:400;\">Desde su lanzamiento, </span><i><span style=\"font-weight:400;\">This Old Dog</span></i><span style=\"font-weight:400;\"> recibió elogios tanto de críticos como de fans, siendo reconocido como uno de los mejores álbumes de 2017. Su popularidad llevó a Mac a realizar una extensa gira mundial, solidificando su posición como referente del género indie rock, además de dar una gran fama al género indie.</span></p>\r\n<h3><b>¿Por qué deberías escucharlo?</b></h3>\r\n<p><span style=\"font-weight:400;\">Si eres una persona que valora la música introspectiva y con un toque de nostalgia, This Old Dog es un álbum hecho para ti. Está dirigido a quienes buscan canciones con profundidad emocional, ideales para momentos de reflexión o para disfrutar en un ambiente relajado.</span></p>\r\n<p style=\"text-align:right;\"><strong>Jose Antonio Díaz Soriano</strong></p>', '2024-12-22 13:00:41', '2024-12-21 14:35:42', 0, 1, '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_tags`
--

CREATE TABLE `omeka_tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_tags`
--

INSERT INTO `omeka_tags` (`id`, `name`) VALUES
(46, '1786'),
(34, '1791'),
(45, '1912'),
(31, '1962'),
(30, '1971'),
(32, '1980'),
(49, '1991'),
(39, '1992'),
(55, '2-3 minutos'),
(28, '2000'),
(26, '2004'),
(24, '2009'),
(38, '2011'),
(51, '2012'),
(25, '2013'),
(37, '2016'),
(27, '2017'),
(36, '2018'),
(35, '2019'),
(29, '2021'),
(56, '3-4 minutos'),
(16, 'Alternativa'),
(19, 'Alternativa Experimental'),
(59, 'América del Norte'),
(43, 'Born to Die'),
(23, 'Cantos y Rituales'),
(2, 'Country'),
(3, 'Country Tradicional'),
(48, 'El mal querer'),
(12, 'Electrónica'),
(15, 'Electrónica Dubstep'),
(14, 'Electrónica House'),
(13, 'Electrónica Techno'),
(58, 'Europa'),
(47, 'Flamenco'),
(17, 'Indie Pop'),
(18, 'Indie Rock'),
(9, 'Jazz'),
(11, 'Jazz Fusión'),
(10, 'Jazz Tradicional'),
(57, 'Más de 4 minutos'),
(54, 'Menos de 2 minutos'),
(52, 'Microdosis'),
(21, 'Moderna'),
(7, 'Música Clásica'),
(22, 'Música Folklórica'),
(1, 'Música Urbana'),
(42, 'Neon Grave EP'),
(50, 'Nevermind'),
(60, 'Oceanía'),
(20, 'Ópera'),
(44, 'Pablo Honey'),
(4, 'Pop'),
(8, 'Pop Alternativo'),
(5, 'Pop Electrónico'),
(6, 'Pop Mainstream'),
(53, 'Reggaeton'),
(33, 'Rock'),
(41, 'Selected EP'),
(40, 'When we all fall asleep where do we go');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_users`
--

CREATE TABLE `omeka_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(30) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` varchar(40) DEFAULT NULL,
  `salt` varchar(16) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `role` varchar(40) NOT NULL DEFAULT 'default'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `omeka_users`
--

INSERT INTO `omeka_users` (`id`, `username`, `name`, `email`, `password`, `salt`, `active`, `role`) VALUES
(1, 'localhost', 'Super User', 'javierner2005@gmail.com', 'd10078e9e61b85bf8572e2901627bc08812e2041', 'f5e48190b8517591', 1, 'super');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `omeka_users_activations`
--

CREATE TABLE `omeka_users_activations` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `url` varchar(100) DEFAULT NULL,
  `added` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `omeka_collections`
--
ALTER TABLE `omeka_collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `public` (`public`),
  ADD KEY `featured` (`featured`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indices de la tabla `omeka_elements`
--
ALTER TABLE `omeka_elements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_element_set_id` (`element_set_id`,`name`),
  ADD UNIQUE KEY `order_element_set_id` (`element_set_id`,`order`),
  ADD KEY `element_set_id` (`element_set_id`);

--
-- Indices de la tabla `omeka_element_sets`
--
ALTER TABLE `omeka_element_sets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `record_type` (`record_type`);

--
-- Indices de la tabla `omeka_element_texts`
--
ALTER TABLE `omeka_element_texts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `record_type_record_id` (`record_type`,`record_id`),
  ADD KEY `element_id` (`element_id`),
  ADD KEY `text` (`text`(20));

--
-- Indices de la tabla `omeka_files`
--
ALTER TABLE `omeka_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indices de la tabla `omeka_items`
--
ALTER TABLE `omeka_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_type_id` (`item_type_id`),
  ADD KEY `collection_id` (`collection_id`),
  ADD KEY `public` (`public`),
  ADD KEY `featured` (`featured`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indices de la tabla `omeka_item_types`
--
ALTER TABLE `omeka_item_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `omeka_item_types_elements`
--
ALTER TABLE `omeka_item_types_elements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_type_id_element_id` (`item_type_id`,`element_id`),
  ADD KEY `item_type_id` (`item_type_id`),
  ADD KEY `element_id` (`element_id`);

--
-- Indices de la tabla `omeka_keys`
--
ALTER TABLE `omeka_keys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indices de la tabla `omeka_options`
--
ALTER TABLE `omeka_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `omeka_plugins`
--
ALTER TABLE `omeka_plugins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `active_idx` (`active`);

--
-- Indices de la tabla `omeka_processes`
--
ALTER TABLE `omeka_processes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pid` (`pid`),
  ADD KEY `started` (`started`),
  ADD KEY `stopped` (`stopped`);

--
-- Indices de la tabla `omeka_records_tags`
--
ALTER TABLE `omeka_records_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tag` (`record_type`,`record_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indices de la tabla `omeka_schema_migrations`
--
ALTER TABLE `omeka_schema_migrations`
  ADD UNIQUE KEY `unique_schema_migrations` (`version`);

--
-- Indices de la tabla `omeka_search_texts`
--
ALTER TABLE `omeka_search_texts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `record_name` (`record_type`,`record_id`);
ALTER TABLE `omeka_search_texts` ADD FULLTEXT KEY `text` (`text`);

--
-- Indices de la tabla `omeka_sessions`
--
ALTER TABLE `omeka_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `omeka_simple_pages_pages`
--
ALTER TABLE `omeka_simple_pages_pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `is_published` (`is_published`),
  ADD KEY `inserted` (`inserted`),
  ADD KEY `updated` (`updated`),
  ADD KEY `created_by_user_id` (`created_by_user_id`),
  ADD KEY `modified_by_user_id` (`modified_by_user_id`),
  ADD KEY `order` (`order`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indices de la tabla `omeka_tags`
--
ALTER TABLE `omeka_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `omeka_users`
--
ALTER TABLE `omeka_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `active_idx` (`active`);

--
-- Indices de la tabla `omeka_users_activations`
--
ALTER TABLE `omeka_users_activations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `omeka_collections`
--
ALTER TABLE `omeka_collections`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `omeka_elements`
--
ALTER TABLE `omeka_elements`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `omeka_element_sets`
--
ALTER TABLE `omeka_element_sets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `omeka_element_texts`
--
ALTER TABLE `omeka_element_texts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=193;

--
-- AUTO_INCREMENT de la tabla `omeka_files`
--
ALTER TABLE `omeka_files`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `omeka_items`
--
ALTER TABLE `omeka_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `omeka_item_types`
--
ALTER TABLE `omeka_item_types`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `omeka_item_types_elements`
--
ALTER TABLE `omeka_item_types_elements`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `omeka_keys`
--
ALTER TABLE `omeka_keys`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `omeka_options`
--
ALTER TABLE `omeka_options`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `omeka_plugins`
--
ALTER TABLE `omeka_plugins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `omeka_processes`
--
ALTER TABLE `omeka_processes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `omeka_records_tags`
--
ALTER TABLE `omeka_records_tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT de la tabla `omeka_search_texts`
--
ALTER TABLE `omeka_search_texts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `omeka_simple_pages_pages`
--
ALTER TABLE `omeka_simple_pages_pages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `omeka_tags`
--
ALTER TABLE `omeka_tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `omeka_users`
--
ALTER TABLE `omeka_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `omeka_users_activations`
--
ALTER TABLE `omeka_users_activations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
