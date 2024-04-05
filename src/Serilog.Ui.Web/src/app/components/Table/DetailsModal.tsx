import loadable from '@loadable/component';
import {
  Box,
  Button,
  Modal,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { memo } from 'react';
import { boxButton, overlayProps } from 'style/modal';
import { LogType } from 'types/types';
import { capitalize } from '../../util/prettyPrints';

const CodeContent = loadable(() => import('./CodeContent'));

const DetailsModal = ({
  modalContent,
  buttonTitle,
  modalTitle,
  contentType,
  disabled,
}: {
  modalContent: string;
  buttonTitle: string;
  modalTitle?: string;
  contentType?: string;
  disabled?: boolean;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        radius="sm"
        size="xl"
        title={modalTitle}
        overlayProps={overlayProps(colorScheme, theme.colors)}
      >
        <CodeContent prop={modalContent} codeType={contentType as LogType} />
      </Modal>

      <Box display="grid" style={boxButton}>
        <Button size="compact-sm" disabled={disabled} onClick={open}>
          {capitalize(buttonTitle)}
        </Button>
      </Box>
    </>
  );
};

export default memo(DetailsModal);
