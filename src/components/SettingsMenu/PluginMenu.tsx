import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import PopupModal from '@components/PopupModal';
import useStore from '@store/store';
import { PluginDefinition } from '@type/plugin';
import { defaultPluginDefinitions } from '@utils/plugins';

const newPlugin = (): PluginDefinition => ({
  ...defaultPluginDefinitions()[0],
  id: uuidv4(),
  name: 'my_plugin',
  description: 'Describe when ChatGPT should call this plugin.',
  enabled: false,
});

const PluginMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        className='btn btn-neutral'
        onClick={() => setIsModalOpen(true)}
        aria-label='JavaScript plugins'
      >
        JavaScript plugins
      </button>
      {isModalOpen && <PluginPopup setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

const PluginPopup = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const setPlugins = useStore((state) => state.setPlugins);
  const [plugins, setLocalPlugins] = useState<PluginDefinition[]>(
    JSON.parse(JSON.stringify(useStore.getState().plugins))
  );

  const updatePlugin = (
    id: string,
    updates: Partial<PluginDefinition>
  ): void => {
    setLocalPlugins((current) =>
      current.map((plugin) =>
        plugin.id === id ? { ...plugin, ...updates } : plugin
      )
    );
  };

  const removePlugin = (id: string): void => {
    setLocalPlugins((current) => current.filter((plugin) => plugin.id !== id));
  };

  const addCalculatorPlugin = (): void => {
    setLocalPlugins((current) => [...current, ...defaultPluginDefinitions()]);
  };

  const handleSave = (): void => {
    setPlugins(plugins);
    setIsModalOpen(false);
  };

  return (
    <PopupModal
      title='JavaScript plugins'
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600 w-[90vw] max-w-2xl text-sm text-gray-900 dark:text-gray-300'>
        <p className='mb-4 text-xs text-gray-600 dark:text-gray-300'>
          Enabled plugins are exposed to OpenAI as function specs. Their
          JavaScript runs locally in this browser, so only enable code you
          trust.
        </p>

        <div className='mb-4 flex flex-wrap gap-2'>
          <button
            type='button'
            className='btn btn-neutral btn-small'
            onClick={() => setLocalPlugins((current) => [...current, newPlugin()])}
          >
            Add plugin
          </button>
          <button
            type='button'
            className='btn btn-neutral btn-small'
            onClick={addCalculatorPlugin}
          >
            Add calculator example
          </button>
        </div>

        <div className='flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1'>
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className='rounded border border-gray-300 p-3 dark:border-gray-600'
            >
              <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={plugin.enabled}
                    onChange={(event) =>
                      updatePlugin(plugin.id, {
                        enabled: event.target.checked,
                      })
                    }
                  />
                  <span>Enabled</span>
                </label>
                <button
                  type='button'
                  className='btn btn-neutral btn-small'
                  onClick={() => removePlugin(plugin.id)}
                >
                  Remove
                </button>
              </div>

              <label className='mb-3 block'>
                <span className='mb-1 block text-xs font-medium'>
                  Function name
                </span>
                <input
                  className='w-full rounded border border-gray-400/50 bg-transparent px-2 py-1'
                  value={plugin.name}
                  onChange={(event) =>
                    updatePlugin(plugin.id, { name: event.target.value })
                  }
                />
              </label>

              <label className='mb-3 block'>
                <span className='mb-1 block text-xs font-medium'>
                  Description
                </span>
                <textarea
                  className='min-h-[4rem] w-full resize-y rounded border border-gray-400/50 bg-transparent px-2 py-1'
                  value={plugin.description}
                  onChange={(event) =>
                    updatePlugin(plugin.id, {
                      description: event.target.value,
                    })
                  }
                />
              </label>

              <label className='mb-3 block'>
                <span className='mb-1 block text-xs font-medium'>
                  Parameters JSON schema
                </span>
                <textarea
                  className='min-h-[9rem] w-full resize-y rounded border border-gray-400/50 bg-transparent px-2 py-1 font-mono text-xs'
                  value={plugin.parameters}
                  onChange={(event) =>
                    updatePlugin(plugin.id, {
                      parameters: event.target.value,
                    })
                  }
                />
              </label>

              <label className='block'>
                <span className='mb-1 block text-xs font-medium'>
                  JavaScript body
                </span>
                <textarea
                  className='min-h-[10rem] w-full resize-y rounded border border-gray-400/50 bg-transparent px-2 py-1 font-mono text-xs'
                  value={plugin.code}
                  onChange={(event) =>
                    updatePlugin(plugin.id, { code: event.target.value })
                  }
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </PopupModal>
  );
};

export default PluginMenu;
