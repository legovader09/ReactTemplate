import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';
import * as JSZip from 'jszip';

type Asset = {
  url: string;
  type: string;
  size: number;
};

type AssetContextType = {
  isLoading: boolean;
  error: Error | null;
  getAsset: (filename: string) => Asset | undefined;
  getAllAssets: () => [string, Asset][];
  assetCount: number;
} | null;

interface AssetProviderProps {
  children: ReactNode;
  zipPath: string;
}

const AssetContext = createContext<AssetContextType>(null);

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};

export const AssetProvider: React.FC<AssetProviderProps> = ({ children, zipPath }) => {
  const [assets, setAssets] = useState<Map<string, Asset>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(zipPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch ZIP: ${response.status}`);
        }

        const zipBlob = await response.blob();
        const zip = await JSZip.loadAsync(zipBlob);
        const newAssets = new Map<string, Asset>();

        await Promise.all(
          Object.keys(zip.files).map(async (filename) => {
            const file = zip.files[filename];
            if (!file.dir) {
              const blob = await file.async('blob');
              const url = URL.createObjectURL(blob);
              newAssets.set(filename, {
                url,
                type: blob.type,
                size: blob.size,
              });
            }
          }),
        );

        setAssets(newAssets);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading assets:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    loadAssets();

    return () => {
      assets.forEach((asset) => {
        if (asset.url) {
          URL.revokeObjectURL(asset.url);
        }
      });
    };
  }, [zipPath]);

  const getAsset = (filename: string) => assets.get(filename);
  const getAllAssets = () => Array.from(assets.entries());

  const value = React.useMemo(() => ({
    isLoading,
    error,
    getAsset,
    getAllAssets,
    assetCount: assets.size,
  }), [isLoading, error, assets]);

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
};