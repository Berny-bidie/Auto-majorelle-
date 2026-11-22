-- Keep the persisted public showroom address aligned with the address confirmed by the business.
update public.site_settings
set value = 'Quartier industriel Sidi Ghanem 127, Marrakech 40000, Marrakech-Safi, Maroc'
where key = 'address'
  and value is distinct from 'Quartier industriel Sidi Ghanem 127, Marrakech 40000, Marrakech-Safi, Maroc';

-- Remove the obsolete internal instruction that pointed visitors to Alfa 2000.
update public.site_settings
set value = 'Adresse officielle confirmée par l’entreprise : Quartier industriel Sidi Ghanem 127, Marrakech 40000, Marrakech-Safi, Maroc.'
where key = 'internalAddressNote'
  and value ilike '%Alfa 2000%';
