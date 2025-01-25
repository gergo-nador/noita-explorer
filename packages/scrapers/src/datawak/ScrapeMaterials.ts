import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  NoitaMaterial,
  NoitaMaterialReaction,
  NoitaMaterialReactionComponent,
  NoitaTranslation,
  NoitaMaterialCellType,
  NoitaMaterialCellTypeValidValues,
} from '@noita-explorer/model-noita';
import { noitaPaths } from '../NoitaPaths.ts';
import {
  parseXml,
  XmlWrapper,
  XmlWrapperType,
} from '@noita-explorer/tools/xml';
import { colorHelpers, stringHelpers } from '@noita-explorer/tools';

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

  const materials: NoitaMaterial[] = [];

  const materialTags = [...cellDataTags, ...cellDataChildTags];
  for (const c of materialTags) {
    const material = await extractCellData({
      xml: c,
      translations: translations,
      dataWakParentDirectoryApi: dataWakParentDirectoryApi,
    });

    materials.push(material);
  }

  const reactions = reactionTags.map((r) =>
    extractReaction({ reactionXml: r }),
  );

  return { materials, reactions };
};

const extractCellData = async ({
  xml,
  translations,
  dataWakParentDirectoryApi,
}: {
  xml: XmlWrapperType;
  translations: StringKeyDictionary<NoitaTranslation>;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}): Promise<NoitaMaterial> => {
  const id = xml.getRequiredAttribute('name').asText()!;
  const tags = xml.getAttribute('tags')?.asText();

  const material: NoitaMaterial = {
    id: id,
    name: id,
    cellType: 'liquid',
    tags: tags !== undefined ? tags.split(',') : [],

    burnable: xml.getAttribute('burnable')?.asBoolean() ?? false,
    density: xml.getAttribute('density')?.asInt(),
    durability: xml.getAttribute('durability')?.asInt(),
    electricalConductivity: false,
    hardness: xml.getAttribute('hp')?.asInt(),
    liquidSand: xml.getAttribute('liquid_sand')?.asBoolean() ?? false,
    stickiness: xml.getAttribute('stickiness')?.asFloat(),
    wangColor: xml.getAttribute('wang_color')?.asText() ?? '_NO_WANG_COLOR_',

    gfxGlow: xml.getAttribute('gfx_glow')?.asInt(),
    gfxGlowColor: xml.getAttribute('gfx_glow_color')?.asText(),
    graphicsColor: undefined,
    graphicsImageBase64: undefined,

    parent: undefined,
    stainEffects: [],
    ingestionEffects: [],
  };

  const nameTranslation = xml.getAttribute('ui_name')?.asText();
  if (nameTranslation !== undefined) {
    const nameTranslationId = stringHelpers.trim({
      text: nameTranslation,
      fromStart: '$',
    });
    material.name = translations[nameTranslationId]?.en ?? nameTranslationId;
  }

  // cell type
  const cellType = xml
    .getAttribute('cell_type')
    ?.asText() as NoitaMaterialCellType;
  if (cellType && NoitaMaterialCellTypeValidValues.has(cellType)) {
    material.cellType = cellType;
  }

  // electrical conductivity
  const electricalConductivity = xml
    .getAttribute('electrical_conductivity')
    ?.asBoolean();
  if (electricalConductivity !== undefined) {
    material.electricalConductivity = electricalConductivity;
  } else if (material.cellType === 'liquid' && !material.liquidSand) {
    material.electricalConductivity = true;
  }

  // extra tags: [any_liquid] - Refers to any material with cell_type="liquid" and liquid_sand="0"
  if (material.cellType === 'liquid' && !material.liquidSand) {
    material.tags.push('[any_liquid]');
  }
  // extra tags: [any_powder] - Refers to any material with cell_type="liquid" and liquid_sand="1"
  else if (material.cellType === 'liquid' && material.liquidSand) {
    material.tags.push('[any_powder]');
  }
  // extra tags: [*]
  material.tags.push('[*]');

  // graphics
  const graphics = xml.findNthTag('Graphics');
  if (graphics) {
    const color = graphics.getAttribute('color')?.asText();
    if (color) {
      material.graphicsColor = '#' + colorHelpers.conversion.argbToRgba(color);
    }

    const textureFilePath = graphics.getAttribute('texture_file')?.asText();
    if (textureFilePath) {
      const pathExists =
        await dataWakParentDirectoryApi.checkRelativePathExists(
          textureFilePath,
        );

      if (pathExists) {
        const textureFile =
          await dataWakParentDirectoryApi.getFile(textureFilePath);

        const image = await textureFile.read.asImageBase64();
        material.graphicsImageBase64 = image;
      }
    }

    // TODO: Edge files
  }

  // effects: stains
  const stains = xml.findNthTag('Stains');
  if (stains) {
    const effects = stains.findTagArray('StatusEffect');

    for (const effect of effects) {
      material.stainEffects.push({
        effectType: effect.getRequiredAttribute('type').asText()!,
      });
    }
  }

  // effects: ingestion
  const ingestion = xml.findNthTag('Ingestion');
  if (ingestion) {
    const effects = ingestion.findTagArray('StatusEffect');

    for (const effect of effects) {
      material.ingestionEffects.push({
        effectType: effect.getRequiredAttribute('type').asText()!,
        effectAmount: effect.getAttribute('amount')?.asFloat(),
      });
    }
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

  const reaction: NoitaMaterialReaction = {
    probability: probability,
    inputComponents: inputComponents,
    outputComponents: outputComponents,
    fastReaction:
      reactionXml.getAttribute('fast_reaction')?.asBoolean() ?? false,
    convertAll: reactionXml.getAttribute('convert_all')?.asBoolean() ?? false,
    direction: reactionXml.getAttribute('direction')?.asText(),
    explosion: undefined,
  };

  const explosionTag = reactionXml.findNthTag('Explosion');
  if (explosionTag) {
    reaction.explosion = {
      explosionPower:
        explosionTag.getAttribute('cell_explosion_power')?.asInt() ?? 0,
    };
  }

  return reaction;
};

/*
https://noita.wiki.gg/wiki/Modding:_Making_a_custom_material#List_of_all_known_material_properties
https://noita.wiki.gg/wiki/Documentation:_Reaction

input/output cells can be:
- tags: [meltable_metal], [regenerative]
- tags + state: [meltable_metal]_molten, [rust_oxide]_oxide
- exact: diamond, void_liquid, oil



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
