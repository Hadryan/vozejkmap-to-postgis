CREATE SCHEMA vozejkmap;

SET search_path=vozejkmap,public;

CREATE TABLE vozejkmap_raw(id SERIAL PRIMARY KEY, raw text);

COPY vozejkmap_raw(raw) FROM '/tmp/locations.json' DELIMITERS '#' ESCAPE '\' CSV;

CREATE TABLE vozejkmap AS
    SELECT
        id,
        trim(
            split_part(
                split_part(
                    raw, 'title:', 2
                ),
                ',location_type:', 1
            )
        ) AS title,

        trim(
            split_part(
                split_part(
                    raw, 'location_type:', 2
                ),
                ',description:', 1
            )
        )::integer AS location_type,

        trim(
            split_part(
                split_part(
                    raw, 'description:', 2
                ),
                ',lat:', 1
            )
        ) AS description,

        cast( trim(
            split_part(
                split_part(
                    raw, 'lat:', 2
                ),
                ',lng:', 1
            )
        ) AS double precision) AS lat,

        cast( trim(
            split_part(
                split_part(
                    raw, 'lng:', 2
                ),
                ',attr1:', 1
            )
        )  AS double precision) AS lng,

        trim(
            split_part(
                split_part(
                    raw, 'attr1:', 2
                ),
                ',attr2:', 1
            )
        )::integer AS attr1,

        trim(
            split_part(
                split_part(
                    raw, 'attr2:', 2
                ),
                ',attr3:', 1
            )
        ) AS attr2,

        trim(
            split_part(
                split_part(
                    raw, 'attr3:', 2
                ),
                ',author_name:', 1
            )
        ) AS attr3,

        trim(
            split_part(
                split_part(
                    raw, 'author_name:', 2
                ),
                ',}:', 1
            )
        ) AS author_name

    FROM vozejkmap_raw;

CREATE TABLE location_type (
    id integer PRIMARY KEY,
    description varchar(255)
);

INSERT INTO location_type VALUES(1, 'Kultura');
INSERT INTO location_type VALUES(2, 'Sport');
INSERT INTO location_type VALUES(3, 'Instituce');
INSERT INTO location_type VALUES(4, 'Jídlo a pití');
INSERT INTO location_type VALUES(5, 'Ubytování');
INSERT INTO location_type VALUES(6, 'Lékaři, lékárny');
INSERT INTO location_type VALUES(7, 'Jiné');
INSERT INTO location_type VALUES(8, 'Doprava');
INSERT INTO location_type VALUES(9, 'Veřejné WC');
INSERT INTO location_type VALUES(10, 'Benzínka');
INSERT INTO location_type VALUES(11, 'Obchod');
INSERT INTO location_type VALUES(12, 'Banka, bankomat');
INSERT INTO location_type VALUES(13, 'Parkoviště');
INSERT INTO location_type VALUES(14, 'Prodejní a servisní místa Škoda Auto');


DROP TABLE vozejkmap_raw;
ALTER TABLE vozejkmap ADD PRIMARY KEY(id);
ALTER TABLE vozejkmap ADD COLUMN geom geometry(point, 4326);
ALTER TABLE vozejkmap ADD CONSTRAINT loctype_fk FOREIGN KEY(location_type) REFERENCES location_type(id);

UPDATE vozejkmap SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326);