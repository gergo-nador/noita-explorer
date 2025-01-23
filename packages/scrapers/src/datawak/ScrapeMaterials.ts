import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  NoitaMaterial,
  NoitaMaterialReaction,
  NoitaMaterialReactionComponent,
  NoitaTranslation,
} from '@noita-explorer/model-noita';
import { noitaPaths } from '../NoitaPaths.ts';
import {
  parseXml,
  XmlWrapper,
  XmlWrapperType,
} from '@noita-explorer/tools/xml';
import { stringHelpers } from '@noita-explorer/tools';

export const scrapeMaterials = async ({
  dataWakParentDirectoryApi,
  translations,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  translations: StringKeyDictionary<NoitaTranslation>;
}): Promise<{
  materials: NoitaMaterial[];
  reactions: NoitaMaterialReaction[];
}> => {
  const materialsPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.xmlData.materials,
  );
  const materialsFile = await dataWakParentDirectoryApi.getFile(materialsPath);

  const xmlText = await materialsFile.read.asText();
  const xmlObj = await parseXml(xmlText);
  const xmlWrapper = XmlWrapper(xmlObj);

  const materialsTag = xmlWrapper.findNthTag('Materials');
  if (materialsTag === undefined) {
    throw new Error('Could not find Materials tag');
  }

  const cellDataTags = materialsTag.findTagArray('CellData');
  const cellDataChildTags = materialsTag.findTagArray('CellDataChild');
  const reactionTags = materialsTag.findTagArray('Reaction');

  const materials = [
    ...cellDataTags.map((c) =>
      extractCellData({ xml: c, translations: translations }),
    ),
    ...cellDataChildTags.map((c) =>
      extractCellData({ xml: c, translations: translations }),
    ),
  ];

  const reactions = reactionTags.map((r) =>
    extractReaction({ reactionXml: r }),
  );

  return { materials, reactions };
};

const extractCellData = ({
  xml,
  translations,
}: {
  xml: XmlWrapperType;
  translations: StringKeyDictionary<NoitaTranslation>;
}): NoitaMaterial => {
  const id = xml.getRequiredAttribute('name').asText()!;
  const tags = xml.getAttribute('tags')?.asText();

  const material: NoitaMaterial = {
    id: id,
    name: id,
    burnable: xml.getAttribute('burnable')?.asBoolean() ?? false,
    density: xml.getAttribute('density')?.asInt(),
    tags: tags !== undefined ? tags.split(',') : [],
    cellType: xml.getAttribute('cell_type')?.asText(),
  };

  const nameTranslation = xml.getAttribute('ui_name')?.asText();
  if (nameTranslation !== undefined) {
    const nameTranslationId = stringHelpers.trim({
      text: nameTranslation,
      fromStart: '$',
    });
    material.name = translations[nameTranslationId].en ?? nameTranslationId;
  }

  return material;
};

const extractReaction = ({
  reactionXml,
}: {
  reactionXml: XmlWrapperType;
}): NoitaMaterialReaction => {
  const probability = reactionXml.getRequiredAttribute('probability').asInt()!;
  const inputComponents: NoitaMaterialReactionComponent[] = [];
  const outputComponents: NoitaMaterialReactionComponent[] = [];

  const cellNumbering = [1, 2, 3];

  for (const cellNumber of cellNumbering) {
    // input materials
    const inputCell = reactionXml
      .getAttribute('input_cell' + cellNumber)
      ?.asText();

    if (inputCell !== undefined) {
      inputComponents.push({
        componentId: inputCell,
      });
    }

    // output materials
    const outputCell = reactionXml
      .getAttribute('output_cell' + cellNumber)
      ?.asText();

    if (outputCell !== undefined) {
      outputComponents.push({
        componentId: outputCell,
      });
    }
  }

  return {
    probability: probability,
    inputComponents: inputComponents,
    outputComponents: outputComponents,
  };
};

/*
Example Reactions
    <Reaction probability="30"
    	input_cell1="[fire_strong]" 		input_cell2="[meltable_metal]"
    	output_cell1="[fire_strong]" 		output_cell2="[meltable_metal]_molten"  >
      </Reaction>

    <Reaction probability="1"
       input_cell1="[rust_oxide]" 			input_cell2="[water]"
       output_cell1="[rust_oxide]_oxide" 	output_cell2="[water]" >
    </Reaction>

    <Reaction probability="100"
		input_cell1="shock_powder" input_cell2="air"
		output_cell1="air" output_cell2="air"
		entity="data/entities/misc/shock_powder.xml"
		>
	</Reaction>

	<Reaction probability="10"
		input_cell1="meat" input_cell2="[fire]" input_cell3="oil"
		output_cell1="meat_warm" output_cell2="[fire]" output_cell3="smoke"
		blob_radius1="5"
		blob_restrict_to_input_material1="1"
		>
	</Reaction>

	<Reaction probability="100"
		input_cell1="diamond" input_cell2="magic_liquid_random_polymorph" input_cell3="radioactive_liquid"
		output_cell1="void_liquid" output_cell2="void_liquid" output_cell3="void_liquid"
		>
	</Reaction>

	<Reaction probability="70"
    	input_cell1="[lava]" 					input_cell2="poison"
    	output_cell1="rock_static_poison"			output_cell2="poison_gas"
    	blob_radius1="4"						blob_radius2="4"
    	blob_restrict_to_input_material1="1" 	blob_restrict_to_input_material2="1"
    	audio_fx_volume_1="100.0" >
    </Reaction>

    <Reaction probability="70"
    	input_cell1="[lava]" 					input_cell2="slime"
    	output_cell1="endslime" 				output_cell2="endslime"
    	cosmetic_particle="fungal_gas"
    	blob_radius1="3"						blob_radius2="3"
    	blob_restrict_to_input_material1="1" 	blob_restrict_to_input_material2="1"
    	audio_fx_volume_1="100.0" >
    </Reaction>

    <Reaction probability="80"
  	  input_cell1="purifying_powder" 	input_cell2="[regenerative]"
  	  output_cell1="gunpowder_unstable"	output_cell2="gunpowder_unstable"
	  blob_radius1="4"	blob_radius2="4"
	  >
    </Reaction>

    <Reaction probability="70"
      input_cell1="acid_gas_static" 	input_cell2="air"
      output_cell1="acid_gas_static" 	output_cell2="acid_gas"
      fast_reaction="1"
      >
    </Reaction>

    <Reaction probability="5"
    	input_cell1="rock_static_wet" 			input_cell2="air"
    	output_cell1="rock_static_wet" 			output_cell2="water_fading"
    	direction="bottom"
    	>
    </Reaction>

      <Reaction probability="50"
    	input_cell1="[slime]" 		input_cell2="[magic_faster]"
    	output_cell1="fire_blue" 	output_cell2="steam"  >
    	<ExplosionConfig

    		cell_explosion_power="30"
    		cell_explosion_damage_required="3000"
    		cell_explosion_radius_min="5"
    		cell_explosion_radius_max="5"
    		cell_explosion_probability="1.1"

    		ray_energy="50000"
    		>
    	</ExplosionConfig>
      </Reaction>

      <Reaction probability="90"
    	input_cell1="cement" 				input_cell2="air"
    	output_cell1="concrete_static" 		output_cell2="air"
    	destroy_horizontally_lonely_pixels="1"
    	req_lifetime="300" >
      </Reaction>
 */
