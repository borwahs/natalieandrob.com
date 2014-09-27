\set title 'Mr. & Mrs. Robert Shaw'
\set source 'Title|AddressLineOne|AddressLineTwo|AddressCity|AddressState|AddressZipCode'
\set lineone '12345 Street One'
\set linetwo 'Apt 111'
\set city 'Some City'
\set state 'IN'
\set  zip '554433'
\set code 'd18cb7'
\set email 'test@test.com'

\set notes null
\set diet null
\set bridegroomnotes null

\set isinviteddinner true
\set isattendingbigday true
\set isattendingdinner false


INSERT INTO reservation (reservation_Title, rsvp_Code_Source, address_Line_One, address_Line_Two,
address_City, address_State, address_Zip_Code, rsvp_Code, email_Address, reservation_Notes,
dietary_Restrictions, notes_For_Bride_Groom, is_Invited_To_Rehearsal_Dinner, is_Attending_Big_Day, is_Attending_Rehearsal_Dinner
, create_date, modified_date)
VALUES
(':title', ':source', ':lineone', ':linetwo',
':city', ':state', ':zip', ':code', ':email', :notes,
:diet, :bridegroomnotes, :isinviteddinner, :isattendingbigday, :isattendingdinner,
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) RETURNING id;
